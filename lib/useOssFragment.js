"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var FragmentResolver_1 = require("./FragmentResolver");
var useRelayEnvironment_1 = require("./useRelayEnvironment");
function useOssFragment(fragmentNode, fragmentRef) {
    var environment = useRelayEnvironment_1.useRelayEnvironment();
    var _a = react_1.useState(null), forceUpdate = _a[1];
    var ref = react_1.useRef(null);
    if (ref.current === null || ref.current === undefined) {
        ref.current = {
            resolver: new FragmentResolver_1.FragmentResolver(forceUpdate),
        };
    }
    var resolver = ref.current.resolver;
    react_1.useEffect(function () {
        return function () {
            resolver.dispose();
        };
    }, [resolver]);
    resolver.resolve(environment, fragmentNode, fragmentRef);
    var data = resolver.getData();
    return [data, resolver];
}
exports.useOssFragment = useOssFragment;
