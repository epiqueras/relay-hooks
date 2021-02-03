(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('relay-runtime'), require('react'), require('fbjs/lib/areEqual'), require('fbjs/lib/invariant'), require('fbjs/lib/warning'), require('@restart/hooks/useMounted')) :
typeof define === 'function' && define.amd ? define(['exports', 'relay-runtime', 'react', 'fbjs/lib/areEqual', 'fbjs/lib/invariant', 'fbjs/lib/warning', '@restart/hooks/useMounted'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['relay-hooks'] = {}, global.relayRuntime, global.React, global.areEqual, global.invariant, global.warning, global.useMounted));
}(this, (function (exports, relayRuntime, React, areEqual, invariant, warning, useMounted) { 'use strict';

var React__default = 'default' in React ? React['default'] : React;
areEqual = areEqual && Object.prototype.hasOwnProperty.call(areEqual, 'default') ? areEqual['default'] : areEqual;
invariant = invariant && Object.prototype.hasOwnProperty.call(invariant, 'default') ? invariant['default'] : invariant;
warning = warning && Object.prototype.hasOwnProperty.call(warning, 'default') ? warning['default'] : warning;
useMounted = useMounted && Object.prototype.hasOwnProperty.call(useMounted, 'default') ? useMounted['default'] : useMounted;

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
var createRelayContext = relayRuntime.__internal.createRelayContext;
var ReactRelayContext = createRelayContext(React__default);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

var NETWORK_ONLY = 'network-only';
var STORE_THEN_NETWORK = 'store-and-network';
var STORE_OR_NETWORK = 'store-or-network';
var STORE_ONLY = 'store-only';
// pagination
var FORWARD = 'forward';

var isNetworkPolicy = function (policy, storeSnapshot) {
    return (policy === NETWORK_ONLY ||
        policy === STORE_THEN_NETWORK ||
        (policy === STORE_OR_NETWORK && !storeSnapshot));
};
var isStorePolicy = function (policy) {
    return policy !== NETWORK_ONLY;
};
// Fetcher
function createOperation(gqlQuery, variables) {
    return relayRuntime.createOperationDescriptor(relayRuntime.getRequest(gqlQuery), variables);
}
// pagination utils
function findConnectionMetadata(fragment) {
    var foundConnectionMetadata = null;
    var isRelayModern = false;
    // for (const fragmentName in fragments) {
    //   const fragment = fragments[fragmentName];
    var connectionMetadata = fragment.metadata && fragment.metadata.connection;
    // HACK: metadata is always set to `undefined` in classic. In modern, even
    // if empty, it is set to null (never undefined). We use that knowlege to
    // check if we're dealing with classic or modern
    if (fragment.metadata !== undefined) {
        isRelayModern = true;
    }
    if (connectionMetadata) {
        invariant(connectionMetadata.length === 1, 'ReactRelayPaginationContainer: Only a single @connection is ' +
            'supported, `%s` has %s.', fragment.name, connectionMetadata.length);
        invariant(!foundConnectionMetadata, 'ReactRelayPaginationContainer: Only a single fragment with ' +
            '@connection is supported.');
        foundConnectionMetadata = __assign(__assign({}, connectionMetadata[0]), { fragmentName: fragment.name });
    }
    //}
    invariant(!isRelayModern || foundConnectionMetadata !== null, 'ReactRelayPaginationContainer: A @connection directive must be present.');
    return foundConnectionMetadata || {};
}
function createGetConnectionFromProps(metadata) {
    var path = metadata.path;
    invariant(path, 'ReactRelayPaginationContainer: Unable to synthesize a ' +
        'getConnectionFromProps function.');
    return function (props) {
        var data = props;
        for (var i = 0; i < path.length; i++) {
            if (!data || typeof data !== 'object') {
                return null;
            }
            data = data[path[i]];
        }
        return data;
    };
}
function createGetFragmentVariables(metadata) {
    var countVariable = metadata.count;
    invariant(countVariable, 'ReactRelayPaginationContainer: Unable to synthesize a ' + 'getFragmentVariables function.');
    return function (prevVars, totalCount) {
        var _a;
        return (__assign(__assign({}, prevVars), (_a = {}, _a[countVariable] = totalCount, _a)));
    };
}
/*eslint-disable */
function toObserver(observerOrCallback) {
    return typeof observerOrCallback === 'function'
        ? {
            error: observerOrCallback,
            complete: observerOrCallback,
            unsubscribe: function (subscription) {
                typeof observerOrCallback === 'function' && observerOrCallback();
            },
        }
        : observerOrCallback || {};
}
/*eslint-enable */
function getPaginationData(paginationData, fragment) {
    if (!paginationData) {
        var metadata = findConnectionMetadata(fragment);
        var getConnectionFromProps = createGetConnectionFromProps(metadata);
        var direction = metadata.direction;
        invariant(direction, 'ReactRelayPaginationContainer: Unable to infer direction of the ' +
            'connection, possibly because both first and last are provided.');
        var getFragmentVariables = createGetFragmentVariables(metadata);
        return {
            direction: direction,
            getConnectionFromProps: getConnectionFromProps,
            getFragmentVariables: getFragmentVariables,
        };
    }
    return paginationData;
}
function getNewSelector(request, s, variables) {
    if (areEqual(variables, s.variables)) {
        // If we're not actually setting new variables, we don't actually want
        // to create a new fragment owner, since areEqualSelectors relies on
        // owner identity.
        // In fact, we don't even need to try to attempt to set a new selector.
        // When fragment ownership is not enabled, setSelector will also bail
        // out since the selector doesn't really change, so we're doing it here
        // earlier.
        return s;
    }
    // NOTE: We manually create the request descriptor here instead of
    // calling createOperationDescriptor() because we want to set a
    // descriptor with *unaltered* variables as the fragment owner.
    // This is a hack that allows us to preserve exisiting (broken)
    // behavior of RelayModern containers while using fragment ownership
    // to propagate variables instead of Context.
    // For more details, see the summary of D13999308
    var requestDescriptor = relayRuntime.createRequestDescriptor(request, variables);
    var selector = relayRuntime.createReaderSelector(s.node, s.dataID, variables, requestDescriptor);
    return selector;
}
function _getConnectionData(_a, props, connectionConfig) {
    var direction = _a.direction, defaultGetConnectionFromProps = _a.getConnectionFromProps;
    // Extract connection data and verify there are more edges to fetch
    var getConnectionFromProps = connectionConfig && connectionConfig.getConnectionFromProps
        ? connectionConfig.getConnectionFromProps
        : defaultGetConnectionFromProps; // todo
    var connectionData = getConnectionFromProps(props);
    if (connectionData == null) {
        return null;
    }
    var _b = relayRuntime.ConnectionInterface.get(), EDGES = _b.EDGES, PAGE_INFO = _b.PAGE_INFO, HAS_NEXT_PAGE = _b.HAS_NEXT_PAGE, HAS_PREV_PAGE = _b.HAS_PREV_PAGE, END_CURSOR = _b.END_CURSOR, START_CURSOR = _b.START_CURSOR;
    invariant(typeof connectionData === 'object', 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' +
        'to return `null` or a plain object with %s and %s properties, got `%s`.', 'useFragment pagination', EDGES, PAGE_INFO, connectionData);
    var edges = connectionData[EDGES];
    var pageInfo = connectionData[PAGE_INFO];
    if (edges == null || pageInfo == null) {
        return null;
    }
    invariant(Array.isArray(edges), 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' +
        'to return an object with %s: Array, got `%s`.', 'useFragment pagination', EDGES, edges);
    invariant(typeof pageInfo === 'object', 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' +
        'to return an object with %s: Object, got `%s`.', 'useFragment pagination', PAGE_INFO, pageInfo);
    var hasMore = direction === FORWARD ? pageInfo[HAS_NEXT_PAGE] : pageInfo[HAS_PREV_PAGE];
    var cursor = direction === FORWARD ? pageInfo[END_CURSOR] : pageInfo[START_CURSOR];
    if (typeof hasMore !== 'boolean' || (edges.length !== 0 && typeof cursor === 'undefined')) {
        warning(false, 'ReactRelayPaginationContainer: Cannot paginate without %s fields in `%s`. ' +
            'Be sure to fetch %s (got `%s`) and %s (got `%s`).', PAGE_INFO, 'useFragment pagination', direction === FORWARD ? HAS_NEXT_PAGE : HAS_PREV_PAGE, hasMore, direction === FORWARD ? END_CURSOR : START_CURSOR, cursor);
        return null;
    }
    return {
        cursor: cursor,
        edgeCount: edges.length,
        hasMore: hasMore,
    };
}
/*eslint-disable */
function getRootVariablesForSelector(selector) {
    return selector != null && selector.kind === 'PluralReaderSelector'
        ? selector.selectors[0]
            ? selector.selectors[0].owner.variables
            : {}
        : selector
            ? selector.owner.variables
            : {};
}

var fetchQuery = relayRuntime.__internal.fetchQuery;
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
        if (isStorePolicy(fetchPolicy)) {
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
            var isNetwork = isNetworkPolicy(fetchPolicy, storeSnapshot);
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

// set query when you want suspends
var useQueryFetcher = function (query) {
    var _a = React.useState(null), forceUpdate = _a[1];
    var ref = React.useRef();
    if (ref.current === null || ref.current === undefined) {
        ref.current = {
            queryFetcher: getOrCreateQueryFetcher(query, forceUpdate),
        };
    }
    //const { queryFetcher } = ref.current;
    React.useEffect(function () {
        return function () { return ref.current.queryFetcher.dispose(); };
    }, []);
    return ref.current.queryFetcher;
};

function useRelayEnvironment() {
    var environment = React__default.useContext(ReactRelayContext).environment;
    return environment;
}

function useDeepCompare(value) {
    var latestValue = React.useRef(value);
    if (!areEqual(latestValue.current, value)) {
        latestValue.current = value;
    }
    return latestValue.current;
}
function useMemoOperationDescriptor(gqlQuery, variables) {
    var memoVariables = useDeepCompare(variables);
    return React.useMemo(function () { return createOperation(gqlQuery, memoVariables); }, [gqlQuery, memoVariables]);
}
var useQuery = function (gqlQuery, variables, options) {
    if (variables === void 0) { variables = {}; }
    if (options === void 0) { options = {}; }
    var environment = useRelayEnvironment();
    var query = useMemoOperationDescriptor(gqlQuery, variables);
    var queryFetcher = useQueryFetcher();
    return queryFetcher.execute(environment, query, options);
};

var useLazyLoadQuery = function (gqlQuery, variables, options) {
    if (variables === void 0) { variables = {}; }
    if (options === void 0) { options = {}; }
    var environment = useRelayEnvironment();
    var query = useMemoOperationDescriptor(gqlQuery, variables);
    var queryFetcher = useQueryFetcher(query);
    return queryFetcher.execute(environment, query, options);
};

var internalLoadQuery = function (promise, queryExecute) {
    if (promise === void 0) { promise = false; }
    if (queryExecute === void 0) { queryExecute = function (queryFetcher, environment, query, options, retain) { return queryFetcher.execute(environment, query, options, retain); }; }
    var data = null;
    var listener = undefined;
    var queryFetcher = new QueryFetcher(true);
    var prev = {
        environment: null,
        gqlQuery: null,
        variables: null,
        options: null,
        query: null,
    };
    var dispose = function () {
        queryFetcher.dispose();
        queryFetcher = new QueryFetcher(true);
        listener = undefined;
        data = null;
        prev = {
            environment: null,
            gqlQuery: null,
            variables: null,
            options: null,
            query: null,
        };
    };
    var next = function (environment, gqlQuery, variables, options) {
        if (variables === void 0) { variables = {}; }
        if (options === void 0) { options = {}; }
        prev.environment = environment;
        prev.options = options;
        if (!areEqual(variables, prev.variables) || gqlQuery != prev.gqlQuery) {
            prev.variables = variables;
            prev.gqlQuery = gqlQuery;
            prev.query = createOperation(gqlQuery, prev.variables);
        }
        var execute = function () {
            data = queryExecute(queryFetcher, prev.environment, prev.query, prev.options);
            listener && listener(data);
        };
        queryFetcher.setForceUpdate(execute);
        var result;
        try {
            execute();
        }
        catch (e) {
            result = e.then(execute);
            if (promise) {
                data = result;
            }
            else {
                execute();
            }
        }
        return result !== null && result !== void 0 ? result : Promise.resolve();
    };
    var getValue = function (environment) {
        if (environment && environment != prev.environment) {
            next(environment, prev.gqlQuery, prev.variables, prev.options);
        }
        if (relayRuntime.isPromise(data)) {
            throw data;
        }
        return data;
    };
    var subscribe = function (callback) {
        listener = callback;
        return function () {
            if (listener === callback) {
                listener = null;
            }
        };
    };
    return {
        next: next,
        subscribe: subscribe,
        getValue: getValue,
        dispose: dispose,
    };
};
var loadLazyQuery = function () {
    return internalLoadQuery(true);
};
var loadQuery = function () {
    return internalLoadQuery(false);
};

var usePreloadedQuery = function (loadQuery) {
    var _a = React.useState(), forceUpdate = _a[1];
    var environment = useRelayEnvironment();
    React.useEffect(function () {
        var dispose = loadQuery.subscribe(forceUpdate);
        return function () { return dispose(); };
    }, [loadQuery]);
    return loadQuery.getValue(environment);
};

var fetchQuery$1 = relayRuntime.__internal.fetchQuery;
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
            _this.paginationData = getPaginationData(_this.paginationData, _this._fragment);
            var connectionData = _getConnectionData(_this.paginationData, _this.getData(), connectionConfig);
            return !!(connectionData && connectionData.hasMore && connectionData.cursor);
        };
        this.refetchConnection = function (connectionConfig, totalCount, observerOrCallback, refetchVariables) {
            _this.paginationData = getPaginationData(_this.paginationData, _this._fragment);
            _this._refetchVariables = refetchVariables;
            var paginatingVariables = {
                count: totalCount,
                cursor: null,
                totalCount: totalCount,
            };
            return _this._fetchPage(connectionConfig, paginatingVariables, toObserver(observerOrCallback), { force: true });
        };
        this.loadMore = function (connectionConfig, pageSize, observerOrCallback, options) {
            _this.paginationData = getPaginationData(_this.paginationData, _this._fragment);
            var observer = toObserver(observerOrCallback);
            var connectionData = _getConnectionData(_this.paginationData, _this.getData(), connectionConfig);
            if (!connectionData) {
                relayRuntime.Observable.create(function (sink) { return sink.complete(); }).subscribe(observer);
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
        return relayRuntime.getVariablesFromFragment(this._fragment, fRef);
    };
    FragmentResolver.prototype.changedFragmentRef = function (fragmentRef) {
        if (this._fragmentRef !== fragmentRef) {
            var prevIDs = relayRuntime.getDataIDsFromFragment(this._fragment, this._fragmentRef);
            var nextIDs = relayRuntime.getDataIDsFromFragment(this._fragment, fragmentRef);
            if (!areEqual(prevIDs, nextIDs) ||
                !areEqual(this.getFragmentVariables(fragmentRef), this.getFragmentVariables(this._fragmentRef))) {
                return true;
            }
        }
        return false;
    };
    FragmentResolver.prototype.resolve = function (environment, fragmentNode, fragmentRef) {
        if (this._fragmentNode !== fragmentNode) {
            this._fragment = relayRuntime.getFragment(fragmentNode);
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
                this._selector = relayRuntime.getSelector(this._fragment, this._fragmentRef);
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
                return getNewSelector(request, s, variables);
            });
        }
        else {
            this._selector = getNewSelector(request, this._selector, variables);
        }
        this.lookup();
    };
    FragmentResolver.prototype.lookupInStore = function (environment, operation, fetchPolicy) {
        if (isStorePolicy(fetchPolicy)) {
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
        var rootVariables = getRootVariablesForSelector(this._selector);
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
        var operation = createOperation(taggedNode, fetchVariables);
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
        var isNetwork = isNetworkPolicy(fetchPolicy, storeSnapshot);
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
            fetchQuery$1(this._environment, operation, fetchQueryOptions)
                .mergeMap(function (payload) {
                return relayRuntime.Observable.create(function (sink) {
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

function useOssFragment(fragmentNode, fragmentRef) {
    var environment = useRelayEnvironment();
    var _a = React.useState(null), forceUpdate = _a[1];
    var ref = React.useRef(null);
    if (ref.current === null || ref.current === undefined) {
        ref.current = {
            resolver: new FragmentResolver(forceUpdate),
        };
    }
    var resolver = ref.current.resolver;
    React.useEffect(function () {
        return function () {
            resolver.dispose();
        };
    }, [resolver]);
    resolver.resolve(environment, fragmentNode, fragmentRef);
    var data = resolver.getData();
    return [data, resolver];
}

function useFragment(fragmentNode, fragmentRef) {
    var data = useOssFragment(fragmentNode, fragmentRef)[0];
    return data;
}

var useCallback = React__default.useCallback, useState = React__default.useState;
function useMutation(mutation, userConfig, 
/** if not provided, the context environment will be used. */
environment) {
    if (userConfig === void 0) { userConfig = {}; }
    var _a = useState({
        loading: false,
        data: null,
        error: null,
    }), state = _a[0], setState = _a[1];
    var isMounted = useMounted();
    var relayEnvironment = useRelayEnvironment();
    var resolvedEnvironment = environment || relayEnvironment;
    var configs = userConfig.configs, variables = userConfig.variables, uploadables = userConfig.uploadables, onCompleted = userConfig.onCompleted, onError = userConfig.onError, optimisticUpdater = userConfig.optimisticUpdater, optimisticResponse = userConfig.optimisticResponse, updater = userConfig.updater;
    var mutate = useCallback(function (config) {
        var mergedConfig = __assign({ configs: configs,
            variables: variables,
            uploadables: uploadables,
            onCompleted: onCompleted,
            onError: onError,
            optimisticUpdater: optimisticUpdater,
            optimisticResponse: optimisticResponse,
            updater: updater }, config);
        invariant(mergedConfig.variables, 'you must specify variables');
        setState({
            loading: true,
            data: null,
            error: null,
        });
        return new Promise(function (resolve, reject) {
            function handleError(error) {
                if (isMounted()) {
                    setState({
                        loading: false,
                        data: null,
                        error: error,
                    });
                }
                if (mergedConfig.onError) {
                    mergedConfig.onError(error);
                    resolve();
                }
                else {
                    reject(error);
                }
            }
            relayRuntime.commitMutation(resolvedEnvironment, __assign(__assign({}, mergedConfig), { mutation: mutation, variables: mergedConfig.variables, onCompleted: function (response, errors) {
                    if (errors) {
                        // FIXME: This isn't right. onError expects a single error.
                        handleError(errors);
                        return;
                    }
                    if (isMounted()) {
                        setState({
                            loading: false,
                            data: response,
                            error: null,
                        });
                    }
                    if (mergedConfig.onCompleted) {
                        mergedConfig.onCompleted(response);
                    }
                    resolve(response);
                }, onError: handleError }));
        });
    }, [
        resolvedEnvironment,
        configs,
        mutation,
        variables,
        uploadables,
        onCompleted,
        onError,
        optimisticUpdater,
        optimisticResponse,
        updater,
        isMounted,
    ]);
    return [mutate, state];
}

function useSubscription(config) {
    var environment = useRelayEnvironment();
    React.useEffect(function () {
        var dispose = relayRuntime.requestSubscription(environment, config).dispose;
        return dispose;
    }, [environment, config]);
}

function usePagination(fragmentNode, fragmentRef) {
    var _a = useOssFragment(fragmentNode, fragmentRef), data = _a[0], resolver = _a[1];
    var fns = React.useMemo(function () {
        return {
            loadMore: resolver.loadMore,
            hasMore: resolver.hasMore,
            isLoading: resolver.isLoading,
            refetchConnection: resolver.refetchConnection,
        };
    }, [resolver]);
    return [data, fns];
}

function useRefetch(fragmentNode, fragmentRef) {
    var _a = useOssFragment(fragmentNode, fragmentRef), data = _a[0], refetch = _a[1].refetch;
    return [data, refetch];
}

function useRefetchable(fragmentInput, fragmentRef) {
    var _a = useRefetch(fragmentInput, fragmentRef), data = _a[0], refetch = _a[1];
    var refetchNode = React.useMemo(function () {
        var fragmentNode = relayRuntime.getFragment(fragmentInput);
        var metadata = fragmentNode.metadata;
        invariant(metadata != null, 'useRefetchable: Expected fragment `%s` to be refetchable when using `%s`. ' +
            'Did you forget to add a @refetchable directive to the fragment?', 'useRefetchable', fragmentNode.name);
        var isPlural = metadata.plural;
        invariant(isPlural !== true, 'useRefetchable: Expected fragment `%s` not to be plural when using ' +
            '`%s`. Remove `@relay(plural: true)` from fragment `%s` ' +
            'in order to use it with `%s`.', fragmentNode.name, 'useRefetchable', fragmentNode.name, 'useRefetchable');
        var refetchMetadata = metadata.refetch;
        invariant(refetchMetadata != null, 'useRefetchable: Expected fragment `%s` to be refetchable when using `%s`. ' +
            'Did you forget to add a @refetchable directive to the fragment?', 'useRefetchable', fragmentNode.name);
        // handle both commonjs and es modules
        var refetchableRequest = refetchMetadata.operation.default
            ? refetchMetadata.operation.default
            : refetchMetadata.operation;
        return refetchableRequest;
    }, [fragmentInput]);
    var refetchable = React.useCallback(function (refetchVariables, options) {
        if (options === void 0) { options = {}; }
        return refetch(refetchNode, refetchVariables, options.renderVariables, options.observerOrCallback, options.refetchOptions);
    }, [refetch, refetchNode]);
    return [data, refetchable];
}

var RelayEnvironmentProvider = function (props) {
    var context = React__default.useMemo(function () { return ({ environment: props.environment }); }, [props.environment]);
    return (React__default.createElement(ReactRelayContext.Provider, { value: context }, props.children));
};

Object.defineProperty(exports, 'applyOptimisticMutation', {
enumerable: true,
get: function () {
return relayRuntime.applyOptimisticMutation;
}
});
Object.defineProperty(exports, 'commitLocalUpdate', {
enumerable: true,
get: function () {
return relayRuntime.commitLocalUpdate;
}
});
Object.defineProperty(exports, 'commitMutation', {
enumerable: true,
get: function () {
return relayRuntime.commitMutation;
}
});
Object.defineProperty(exports, 'fetchQuery', {
enumerable: true,
get: function () {
return relayRuntime.fetchQuery;
}
});
Object.defineProperty(exports, 'graphql', {
enumerable: true,
get: function () {
return relayRuntime.graphql;
}
});
Object.defineProperty(exports, 'requestSubscription', {
enumerable: true,
get: function () {
return relayRuntime.requestSubscription;
}
});
exports.FORWARD = FORWARD;
exports.NETWORK_ONLY = NETWORK_ONLY;
exports.ReactRelayContext = ReactRelayContext;
exports.RelayEnvironmentProvider = RelayEnvironmentProvider;
exports.STORE_ONLY = STORE_ONLY;
exports.STORE_OR_NETWORK = STORE_OR_NETWORK;
exports.STORE_THEN_NETWORK = STORE_THEN_NETWORK;
exports.loadLazyQuery = loadLazyQuery;
exports.loadQuery = loadQuery;
exports.useFragment = useFragment;
exports.useLazyLoadQuery = useLazyLoadQuery;
exports.useMutation = useMutation;
exports.useOssFragment = useOssFragment;
exports.usePagination = usePagination;
exports.usePreloadedQuery = usePreloadedQuery;
exports.useQuery = useQuery;
exports.useQueryFetcher = useQueryFetcher;
exports.useRefetch = useRefetch;
exports.useRefetchable = useRefetchable;
exports.useRelayEnvironment = useRelayEnvironment;
exports.useSubscription = useSubscription;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=umd-relay-hooks.js.map
