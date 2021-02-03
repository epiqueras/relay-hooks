"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var useOssFragment_1 = require("./useOssFragment");
function useFragment(fragmentNode, fragmentRef) {
    var data = useOssFragment_1.useOssFragment(fragmentNode, fragmentRef)[0];
    return data;
}
exports.useFragment = useFragment;
