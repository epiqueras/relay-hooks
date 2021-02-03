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
Object.defineProperty(exports, "__esModule", { value: true });
var areEqual = require("fbjs/lib/areEqual");
var invariant = require("fbjs/lib/invariant");
var warning = require("fbjs/lib/warning");
var relay_runtime_1 = require("relay-runtime");
var RelayHooksType_1 = require("./RelayHooksType");
exports.isNetworkPolicy = function (policy, storeSnapshot) {
    return (policy === RelayHooksType_1.NETWORK_ONLY ||
        policy === RelayHooksType_1.STORE_THEN_NETWORK ||
        (policy === RelayHooksType_1.STORE_OR_NETWORK && !storeSnapshot));
};
exports.isStorePolicy = function (policy) {
    return policy !== RelayHooksType_1.NETWORK_ONLY;
};
// Fetcher
function createOperation(gqlQuery, variables) {
    return relay_runtime_1.createOperationDescriptor(relay_runtime_1.getRequest(gqlQuery), variables);
}
exports.createOperation = createOperation;
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
exports.findConnectionMetadata = findConnectionMetadata;
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
exports.createGetConnectionFromProps = createGetConnectionFromProps;
function createGetFragmentVariables(metadata) {
    var countVariable = metadata.count;
    invariant(countVariable, 'ReactRelayPaginationContainer: Unable to synthesize a ' + 'getFragmentVariables function.');
    return function (prevVars, totalCount) {
        var _a;
        return (__assign(__assign({}, prevVars), (_a = {}, _a[countVariable] = totalCount, _a)));
    };
}
exports.createGetFragmentVariables = createGetFragmentVariables;
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
exports.toObserver = toObserver;
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
exports.getPaginationData = getPaginationData;
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
    var requestDescriptor = relay_runtime_1.createRequestDescriptor(request, variables);
    var selector = relay_runtime_1.createReaderSelector(s.node, s.dataID, variables, requestDescriptor);
    return selector;
}
exports.getNewSelector = getNewSelector;
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
    var _b = relay_runtime_1.ConnectionInterface.get(), EDGES = _b.EDGES, PAGE_INFO = _b.PAGE_INFO, HAS_NEXT_PAGE = _b.HAS_NEXT_PAGE, HAS_PREV_PAGE = _b.HAS_PREV_PAGE, END_CURSOR = _b.END_CURSOR, START_CURSOR = _b.START_CURSOR;
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
    var hasMore = direction === RelayHooksType_1.FORWARD ? pageInfo[HAS_NEXT_PAGE] : pageInfo[HAS_PREV_PAGE];
    var cursor = direction === RelayHooksType_1.FORWARD ? pageInfo[END_CURSOR] : pageInfo[START_CURSOR];
    if (typeof hasMore !== 'boolean' || (edges.length !== 0 && typeof cursor === 'undefined')) {
        warning(false, 'ReactRelayPaginationContainer: Cannot paginate without %s fields in `%s`. ' +
            'Be sure to fetch %s (got `%s`) and %s (got `%s`).', PAGE_INFO, 'useFragment pagination', direction === RelayHooksType_1.FORWARD ? HAS_NEXT_PAGE : HAS_PREV_PAGE, hasMore, direction === RelayHooksType_1.FORWARD ? END_CURSOR : START_CURSOR, cursor);
        return null;
    }
    return {
        cursor: cursor,
        edgeCount: edges.length,
        hasMore: hasMore,
    };
}
exports._getConnectionData = _getConnectionData;
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
exports.getRootVariablesForSelector = getRootVariablesForSelector;
