"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var areEqual = require("fbjs/lib/areEqual");
var invariant = require("fbjs/lib/invariant");
var relay_runtime_1 = require("relay-runtime");
var Utils_1 = require("./Utils");
var fetchQuery = relay_runtime_1.__internal.fetchQuery;
function lookupFragment(environment, selector) {
    return selector.kind === 'PluralReaderSelector'
        ? selector.selectors.map(function (s) { return environment.lookup(s); })
        : environment.lookup(selector);
}
function getFragmentResult(snapshot) {
    if (Array.isArray(snapshot)) {
        return { snapshot: snapshot, data: snapshot.map(function (s) { return s.data; }) };
    }
    return { snapshot: snapshot, data: snapshot.data };
}
var FragmentResolver = /** @class */ (function () {
    function FragmentResolver(forceUpdate) {
        var _this = this;
        this._disposable = { dispose: function () { } };
        this._isARequestInFlight = false;
        this._selectionReferences = [];
        this.indexUpdate = 0;
        this.refetch = function (taggedNode, refetchVariables, renderVariables, observerOrCallback, options) {
            //TODO Function
            var fragmentVariables = _this.getFragmentVariables();
            var fetchVariables = typeof refetchVariables === 'function'
                ? refetchVariables(fragmentVariables)
                : refetchVariables;
            var newFragmentVariables = renderVariables
                ? __assign(__assign({}, fetchVariables), renderVariables) : fetchVariables;
            /*eslint-disable */
            var observer = typeof observerOrCallback === 'function'
                ? {
                    next: observerOrCallback,
                    error: observerOrCallback,
                }
                : observerOrCallback || {};
            /*eslint-enable */
            var onNext = function (operation, payload, complete) {
                _this.changeVariables(newFragmentVariables, operation.request.node);
                _this.refreshHooks();
                complete();
            };
            return _this.executeFetcher(taggedNode, fetchVariables, options, observer, onNext);
        };
        // pagination
        this.isLoading = function () {
            return !!_this._refetchSubscription;
        };
        this.hasMore = function (connectionConfig) {
            _this.paginationData = Utils_1.getPaginationData(_this.paginationData, _this._fragment);
            var connectionData = Utils_1._getConnectionData(_this.paginationData, _this.getData(), connectionConfig);
            return !!(connectionData && connectionData.hasMore && connectionData.cursor);
        };
        this.refetchConnection = function (connectionConfig, totalCount, observerOrCallback, refetchVariables) {
            _this.paginationData = Utils_1.getPaginationData(_this.paginationData, _this._fragment);
            _this._refetchVariables = refetchVariables;
            var paginatingVariables = {
                count: totalCount,
                cursor: null,
                totalCount: totalCount,
            };
            return _this._fetchPage(connectionConfig, paginatingVariables, Utils_1.toObserver(observerOrCallback), { force: true });
        };
        this.loadMore = function (connectionConfig, pageSize, observerOrCallback, options) {
            _this.paginationData = Utils_1.getPaginationData(_this.paginationData, _this._fragment);
            var observer = Utils_1.toObserver(observerOrCallback);
            var connectionData = Utils_1._getConnectionData(_this.paginationData, _this.getData(), connectionConfig);
            if (!connectionData) {
                relay_runtime_1.Observable.create(function (sink) { return sink.complete(); }).subscribe(observer);
                return null;
            }
            var totalCount = connectionData.edgeCount + pageSize;
            if (options && options.force) {
                return _this.refetchConnection(connectionConfig, totalCount, observerOrCallback, undefined);
            }
            //const { END_CURSOR, START_CURSOR } = ConnectionInterface.get();
            var cursor = connectionData.cursor;
            /*warning(
                cursor,
                'ReactRelayPaginationContainer: Cannot `loadMore` without valid `%s` (got `%s`)',
                this._direction === FORWARD ? END_CURSOR : START_CURSOR,
                cursor,
            );*/
            var paginatingVariables = {
                count: pageSize,
                cursor: cursor,
                totalCount: totalCount,
            };
            return _this._fetchPage(connectionConfig, paginatingVariables, observer, options);
        };
        this._forceUpdate = forceUpdate;
    }
    FragmentResolver.prototype.refreshHooks = function () {
        this.indexUpdate += 1;
        this._forceUpdate(this.indexUpdate);
    };
    FragmentResolver.prototype.dispose = function () {
        this._disposable && this._disposable.dispose();
        this._refetchSubscription && this._refetchSubscription.unsubscribe();
        this._refetchSubscription = null;
        this.disposeSelectionReferences();
        this._isARequestInFlight = false;
    };
    FragmentResolver.prototype.disposeSelectionReferences = function () {
        this._disposeCacheSelectionReference();
        this._selectionReferences.forEach(function (r) { return r.dispose(); });
        this._selectionReferences = [];
    };
    FragmentResolver.prototype._retainCachedOperation = function (operation) {
        this._disposeCacheSelectionReference();
        this._cacheSelectionReference = this._environment.retain(operation);
    };
    FragmentResolver.prototype._disposeCacheSelectionReference = function () {
        this._cacheSelectionReference && this._cacheSelectionReference.dispose();
        this._cacheSelectionReference = null;
    };
    FragmentResolver.prototype.getFragmentVariables = function (fRef) {
        if (fRef === void 0) { fRef = this._fragmentRef; }
        return relay_runtime_1.getVariablesFromFragment(this._fragment, fRef);
    };
    FragmentResolver.prototype.changedFragmentRef = function (fragmentRef) {
        if (this._fragmentRef !== fragmentRef) {
            var prevIDs = relay_runtime_1.getDataIDsFromFragment(this._fragment, this._fragmentRef);
            var nextIDs = relay_runtime_1.getDataIDsFromFragment(this._fragment, fragmentRef);
            if (!areEqual(prevIDs, nextIDs) ||
                !areEqual(this.getFragmentVariables(fragmentRef), this.getFragmentVariables(this._fragmentRef))) {
                return true;
            }
        }
        return false;
    };
    FragmentResolver.prototype.resolve = function (environment, fragmentNode, fragmentRef) {
        if (this._fragmentNode !== fragmentNode) {
            this._fragment = relay_runtime_1.getFragment(fragmentNode);
            this.paginationData = null;
        }
        if (this._environment !== environment ||
            this._fragmentNode !== fragmentNode ||
            this.changedFragmentRef(fragmentRef)) {
            this._environment = environment;
            this._fragmentNode = fragmentNode;
            this._fragmentRef = fragmentRef;
            this._result = null;
            this.dispose();
            if (this._fragmentRef == null) {
                this._result = { data: null, snapshot: null };
            }
            // If fragmentRef is plural, ensure that it is an array.
            // If it's empty, return the empty array direclty before doing any more work.
            this._isPlural =
                this._fragment.metadata &&
                    this._fragment.metadata.plural &&
                    this._fragment.metadata.plural === true;
            if (this._isPlural) {
                if (this._fragmentRef.length === 0) {
                    this._result = { data: [], snapshot: [] };
                }
            }
            if (!this._result) {
                this._selector = relay_runtime_1.getSelector(this._fragment, this._fragmentRef);
                this.lookup();
            }
        }
    };
    FragmentResolver.prototype.lookup = function () {
        var snapshot = lookupFragment(this._environment, this._selector);
        // if (!isMissingData(snapshot)) { this for promises
        this._result = getFragmentResult(snapshot);
        this.subscribe();
    };
    FragmentResolver.prototype.getData = function () {
        return this._result ? this._result.data : null;
    };
    FragmentResolver.prototype.subscribe = function () {
        var _this = this;
        var environment = this._environment;
        var renderedSnapshot = this._result.snapshot;
        this._disposable && this._disposable.dispose();
        if (!renderedSnapshot) {
            this._disposable = { dispose: function () { } };
        }
        var dataSubscriptions = [];
        if (Array.isArray(renderedSnapshot)) {
            renderedSnapshot.forEach(function (snapshot, idx) {
                dataSubscriptions.push(environment.subscribe(snapshot, function (latestSnapshot) {
                    _this._result.snapshot[idx] = latestSnapshot;
                    _this._result.data[idx] = latestSnapshot.data;
                    _this.refreshHooks();
                }));
            });
        }
        else {
            dataSubscriptions.push(environment.subscribe(renderedSnapshot, function (latestSnapshot) {
                _this._result = getFragmentResult(latestSnapshot);
                _this.refreshHooks();
            }));
        }
        this._disposable = {
            dispose: function () {
                dataSubscriptions.map(function (s) { return s.dispose(); });
            },
        };
    };
    FragmentResolver.prototype.changeVariables = function (variables, request) {
        if (this._selector.kind === 'PluralReaderSelector') {
            this._selector.selectors = this
                ._selector.selectors.map(function (s) {
                return Utils_1.getNewSelector(request, s, variables);
            });
        }
        else {
            this._selector = Utils_1.getNewSelector(request, this._selector, variables);
        }
        this.lookup();
    };
    FragmentResolver.prototype.lookupInStore = function (environment, operation, fetchPolicy) {
        if (Utils_1.isStorePolicy(fetchPolicy)) {
            var check = environment.check(operation);
            if (check === 'available' || check.status === 'available') {
                this._retainCachedOperation(operation);
                return environment.lookup(operation.fragment);
            }
        }
        return null;
    };
    FragmentResolver.prototype._fetchPage = function (connectionConfig, paginatingVariables, observer, options) {
        var _this = this;
        //const { componentRef: _, __relayContext, ...restProps } = this.props;
        //const resolver = prevResult.resolver;
        //const fragments = prevResult.resolver._fragments;
        var rootVariables = Utils_1.getRootVariablesForSelector(this._selector);
        // hack 6.0.0
        var fragmentVariables = __assign(__assign(__assign({}, rootVariables), this.getFragmentVariables()), this._refetchVariables);
        var fetchVariables = connectionConfig.getVariables(this.getData(), {
            count: paginatingVariables.count,
            cursor: paginatingVariables.cursor,
        }, fragmentVariables);
        invariant(typeof fetchVariables === 'object' && fetchVariables !== null, 'ReactRelayPaginationContainer: Expected `getVariables()` to ' +
            'return an object, got `%s` in `%s`.', fetchVariables, 'useFragment pagination');
        fetchVariables = __assign(__assign({}, fetchVariables), this._refetchVariables);
        fragmentVariables = __assign(__assign({}, fetchVariables), fragmentVariables);
        var onNext = function (operation, payload, complete) {
            var prevData = _this.getData();
            var getFragmentVariables = connectionConfig.getFragmentVariables || _this.paginationData.getFragmentVariables;
            _this.changeVariables(getFragmentVariables(fragmentVariables, paginatingVariables.totalCount), operation.request.node);
            var nextData = _this.getData();
            // Workaround slightly different handling for connection in different
            // core implementations:
            // - Classic core requires the count to be explicitly incremented
            // - Modern core automatically appends new items, updating the count
            //   isn't required to see new data.
            //
            // `setState` is only required if changing the variables would change the
            // resolved data.
            // TODO #14894725: remove PaginationContainer equal check
            if (!areEqual(prevData, nextData)) {
                _this.refreshHooks();
                var callComplete = function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        complete();
                        return [2 /*return*/];
                    });
                }); };
                callComplete();
            }
            else {
                complete();
            }
        };
        return this.executeFetcher(connectionConfig.query, fetchVariables, options, observer, onNext);
    };
    FragmentResolver.prototype.executeFetcher = function (taggedNode, fetchVariables, options, observerOrCallback, onNext) {
        var _this = this;
        var cacheConfig = options ? { force: !!options.force } : undefined;
        if (cacheConfig != null && options && options.metadata != null) {
            cacheConfig.metadata = options.metadata;
        }
        /*eslint-disable */
        var observer = typeof observerOrCallback === 'function'
            ? {
                next: observerOrCallback,
                error: observerOrCallback,
            }
            : observerOrCallback || {};
        /*eslint-enable */
        var operation = Utils_1.createOperation(taggedNode, fetchVariables);
        var optionsFetch = options ? options : {};
        var _a = optionsFetch.fetchPolicy, fetchPolicy = _a === void 0 ? 'network-only' : _a;
        var storeSnapshot = this.lookupInStore(this._environment, operation, fetchPolicy);
        if (storeSnapshot != null) {
            onNext(operation, null, function () {
                observer.next && observer.next();
                observer.complete && observer.complete();
            });
        }
        // Cancel any previously running refetch.
        this._refetchSubscription && this._refetchSubscription.unsubscribe();
        // Declare refetchSubscription before assigning it in .start(), since
        // synchronous completion may call callbacks .subscribe() returns.
        var refetchSubscription;
        var isNetwork = Utils_1.isNetworkPolicy(fetchPolicy, storeSnapshot);
        if (!isNetwork) {
            return {
                dispose: function () { },
            };
        }
        if (isNetwork) {
            var reference_1 = this._environment.retain(operation);
            /*eslint-disable */
            var fetchQueryOptions = cacheConfig != null
                ? {
                    networkCacheConfig: cacheConfig,
                }
                : {};
            /*eslint-enable */
            var cleanup = function () {
                _this._selectionReferences = _this._selectionReferences.concat(reference_1);
                if (_this._refetchSubscription === refetchSubscription) {
                    _this._refetchSubscription = null;
                    _this._isARequestInFlight = false;
                }
            };
            this._isARequestInFlight = true;
            fetchQuery(this._environment, operation, fetchQueryOptions)
                .mergeMap(function (payload) {
                return relay_runtime_1.Observable.create(function (sink) {
                    onNext(operation, payload, function () {
                        sink.next(undefined); // pass void to public observer's `next()`
                        sink.complete();
                    });
                });
            })
                // use do instead of finally so that observer's `complete` fires after cleanup
                .do({
                error: cleanup,
                complete: cleanup,
                unsubscribe: cleanup,
            })
                .subscribe(__assign(__assign({}, observer), { start: function (subscription) {
                    refetchSubscription = subscription;
                    _this._refetchSubscription = _this._isARequestInFlight
                        ? refetchSubscription
                        : null;
                    observer.start && observer.start(subscription);
                } }));
        }
        return {
            dispose: function () {
                refetchSubscription && refetchSubscription.unsubscribe();
            },
        };
    };
    return FragmentResolver;
}());
exports.FragmentResolver = FragmentResolver;
