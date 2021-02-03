"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var invariant = require("fbjs/lib/invariant");
var react_1 = require("react");
var relay_runtime_1 = require("relay-runtime");
var useRefetch_1 = require("./useRefetch");
function useRefetchable(fragmentInput, fragmentRef) {
    var _a = useRefetch_1.useRefetch(fragmentInput, fragmentRef), data = _a[0], refetch = _a[1];
    var refetchNode = react_1.useMemo(function () {
        var fragmentNode = relay_runtime_1.getFragment(fragmentInput);
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
    var refetchable = react_1.useCallback(function (refetchVariables, options) {
        if (options === void 0) { options = {}; }
        return refetch(refetchNode, refetchVariables, options.renderVariables, options.observerOrCallback, options.refetchOptions);
    }, [refetch, refetchNode]);
    return [data, refetchable];
}
exports.useRefetchable = useRefetchable;
