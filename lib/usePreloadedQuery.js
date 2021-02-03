"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useRelayEnvironment_1 = require("./useRelayEnvironment");
exports.usePreloadedQuery = function (loadQuery) {
    var _a = react_1.useState(), forceUpdate = _a[1];
    var environment = useRelayEnvironment_1.useRelayEnvironment();
    react_1.useEffect(function () {
        var dispose = loadQuery.subscribe(forceUpdate);
        return function () { return dispose(); };
    }, [loadQuery]);
    return loadQuery.getValue(environment);
};
