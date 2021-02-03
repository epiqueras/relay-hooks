"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var useOssFragment_1 = require("./useOssFragment");
function useRefetch(fragmentNode, fragmentRef) {
    var _a = useOssFragment_1.useOssFragment(fragmentNode, fragmentRef), data = _a[0], refetch = _a[1].refetch;
    return [data, refetch];
}
exports.useRefetch = useRefetch;
