"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useOssFragment_1 = require("./useOssFragment");
function usePagination(fragmentNode, fragmentRef) {
    var _a = useOssFragment_1.useOssFragment(fragmentNode, fragmentRef), data = _a[0], resolver = _a[1];
    var fns = react_1.useMemo(function () {
        return {
            loadMore: resolver.loadMore,
            hasMore: resolver.hasMore,
            isLoading: resolver.isLoading,
            refetchConnection: resolver.refetchConnection,
        };
    }, [resolver]);
    return [data, fns];
}
exports.usePagination = usePagination;
