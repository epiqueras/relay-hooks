"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var relay_runtime_1 = require("relay-runtime");
var Utils_1 = require("./Utils");
var fetchQuery = relay_runtime_1.__internal.fetchQuery;
var defaultPolicy = 'store-or-network';
var cache = new Map();
function getOrCreateQueryFetcher(query, forceUpdate) {
    var suspense = !!query;
    var queryFetcher = suspense && cache.has(query.request.identifier)
        ? cache.get(query.request.identifier)
        : new QueryFetcher(suspense, suspense);
    queryFetcher.setForceUpdate(forceUpdate);
    return queryFetcher;
}
exports.getOrCreateQueryFetcher = getOrCreateQueryFetcher;
var DATA_RETENTION_TIMEOUT = 30 * 1000;
var QueryFetcher = /** @class */ (function () {
    function QueryFetcher(suspense, useLazy) {
        if (suspense === void 0) { suspense = false; }
        if (useLazy === void 0) { useLazy = false; }
        this.suspense = suspense;
        this.useLazy = suspense && useLazy;
        this.setForceUpdate(function () { return undefined; });
    }
    QueryFetcher.prototype.setForceUpdate = function (forceUpdate) {
        this.forceUpdate = forceUpdate;
    };
    QueryFetcher.prototype.dispose = function () {
        this.disposeRequest();
        this.disposeRetain();
    };
    QueryFetcher.prototype.disposeRetain = function () {
        this.clearTemporaryRetain();
        this.disposableRetain && this.disposableRetain.dispose();
        this.query && cache.delete(this.query.request.identifier);
    };
    QueryFetcher.prototype.clearTemporaryRetain = function () {
        clearTimeout(this.releaseQueryTimeout);
        this.releaseQueryTimeout = null;
    };
    QueryFetcher.prototype.temporaryRetain = function () {
        var _this = this;
        var localReleaseTemporaryRetain = function () {
            _this.dispose();
        };
        this.releaseQueryTimeout = setTimeout(localReleaseTemporaryRetain, DATA_RETENTION_TIMEOUT);
    };
    QueryFetcher.prototype.isDiffEnvQuery = function (environment, query) {
        return (environment !== this.environment ||
            query.request.identifier !== this.query.request.identifier);
    };
    QueryFetcher.prototype.lookupInStore = function (environment, operation, fetchPolicy) {
        if (Utils_1.isStorePolicy(fetchPolicy)) {
            var check = environment.check(operation);
            if (check === 'available' || check.status === 'available') {
                return environment.lookup(operation.fragment);
            }
        }
        return null;
    };
    QueryFetcher.prototype.execute = function (environment, query, options, retain) {
        var _this = this;
        if (retain === void 0) { retain = function (environment, query) {
            return environment.retain(query);
        }; }
        var _a = options.fetchPolicy, fetchPolicy = _a === void 0 ? defaultPolicy : _a, networkCacheConfig = options.networkCacheConfig, fetchKey = options.fetchKey, skip = options.skip, fetchObserver = options.fetchObserver;
        var storeSnapshot;
        var retry = function (cacheConfigOverride, observer) {
            if (cacheConfigOverride === void 0) { cacheConfigOverride = networkCacheConfig; }
            _this.disposeRequest();
            _this.fetch(cacheConfigOverride, false, observer);
        };
        if (skip) {
            return {
                cached: false,
                retry: retry,
                error: null,
                props: undefined,
            };
        }
        this.clearTemporaryRetain();
        var isDiffEnvQuery = this.isDiffEnvQuery(environment, query);
        if (isDiffEnvQuery || fetchPolicy !== this.fetchPolicy || fetchKey !== this.fetchKey) {
            if (isDiffEnvQuery) {
                this.disposeRetain();
                this.useLazy && cache.set(query.request.identifier, this);
                this.disposableRetain = retain(environment, query);
            }
            this.environment = environment;
            this.query = query;
            this.fetchPolicy = fetchPolicy;
            this.fetchKey = fetchKey;
            this.disposeRequest();
            storeSnapshot = this.lookupInStore(environment, this.query, fetchPolicy);
            var isNetwork = Utils_1.isNetworkPolicy(fetchPolicy, storeSnapshot);
            if (isNetwork) {
                this.fetch(networkCacheConfig, this.suspense && !storeSnapshot, fetchObserver);
            }
            else if (!!storeSnapshot) {
                this.snapshot = storeSnapshot;
                this.error = null;
                this.subscribe(storeSnapshot);
            }
        }
        var resultSnapshot = storeSnapshot || this.snapshot;
        return {
            cached: !!storeSnapshot,
            retry: retry,
            error: this.error,
            props: resultSnapshot ? resultSnapshot.data : null,
        };
    };
    QueryFetcher.prototype.subscribe = function (snapshot) {
        var _this = this;
        if (this.rootSubscription) {
            this.rootSubscription.dispose();
        }
        this.rootSubscription = this.environment.subscribe(snapshot, function (snapshot) {
            // Read from this._fetchOptions in case onDataChange() was lazily added.
            _this.snapshot = snapshot;
            _this.error = null;
            _this.forceUpdate(snapshot);
        });
    };
    QueryFetcher.prototype.fetch = function (networkCacheConfig, suspense, observer) {
        var _this = this;
        if (observer === void 0) { observer = {}; }
        var fetchHasReturned = false;
        var resolveNetworkPromise = function () { };
        fetchQuery(this.environment, this.query, {
            networkCacheConfig: suspense && !networkCacheConfig ? { force: true } : networkCacheConfig,
        }).subscribe({
            start: function (subscription) {
                _this.networkSubscription = {
                    dispose: function () { return subscription.unsubscribe(); },
                };
                observer.start && observer.start(subscription);
            },
            next: function () {
                _this.error = null;
                _this._onQueryDataAvailable({
                    notifyFirstResult: fetchHasReturned,
                    suspense: suspense,
                    observer: observer,
                });
                resolveNetworkPromise();
            },
            error: function (error) {
                _this.error = error;
                _this.snapshot = null;
                if (fetchHasReturned && !suspense) {
                    _this.forceUpdate(error);
                }
                resolveNetworkPromise();
                _this.networkSubscription = null;
                observer.error && observer.error(error);
            },
            complete: function () {
                _this.networkSubscription = null;
                observer.complete && observer.complete();
            },
            unsubscribe: function (subscription) {
                if (_this.useLazy && !_this.rootSubscription && _this.releaseQueryTimeout) {
                    _this.dispose();
                }
                observer.unsubscribe && observer.unsubscribe(subscription);
            },
        });
        fetchHasReturned = true;
        if (suspense) {
            if (this.useLazy) {
                this.setForceUpdate(function () { return undefined; });
                this.temporaryRetain();
            }
            throw new Promise(function (resolve) {
                resolveNetworkPromise = resolve;
            });
        }
    };
    QueryFetcher.prototype.disposeRequest = function () {
        this.error = null;
        this.snapshot = null;
        if (this.networkSubscription) {
            this.networkSubscription.dispose();
            this.networkSubscription = null;
        }
        if (this.rootSubscription) {
            this.rootSubscription.dispose();
            this.rootSubscription = null;
        }
    };
    QueryFetcher.prototype._onQueryDataAvailable = function (_a) {
        // `_onQueryDataAvailable` can be called synchronously the first time and can be called
        // multiple times by network layers that support data subscriptions.
        // Wait until the first payload to call `onDataChange` and subscribe for data updates.
        var notifyFirstResult = _a.notifyFirstResult, suspense = _a.suspense, observer = _a.observer;
        if (this.snapshot) {
            return;
        }
        this.snapshot = this.environment.lookup(this.query.fragment);
        // Subscribe to changes in the data of the root fragment
        this.subscribe(this.snapshot);
        observer.next && observer.next(this.snapshot);
        if (this.snapshot && notifyFirstResult && !suspense) {
            this.forceUpdate(this.snapshot);
        }
    };
    return QueryFetcher;
}());
exports.QueryFetcher = QueryFetcher;
