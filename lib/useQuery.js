"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var areEqual = require("fbjs/lib/areEqual");
var react_1 = require("react");
var useQueryFetcher_1 = require("./useQueryFetcher");
var useRelayEnvironment_1 = require("./useRelayEnvironment");
var Utils_1 = require("./Utils");
function useDeepCompare(value) {
    var latestValue = react_1.useRef(value);
    if (!areEqual(latestValue.current, value)) {
        latestValue.current = value;
    }
    return latestValue.current;
}
exports.useDeepCompare = useDeepCompare;
function useMemoOperationDescriptor(gqlQuery, variables) {
    var memoVariables = useDeepCompare(variables);
    return react_1.useMemo(function () { return Utils_1.createOperation(gqlQuery, memoVariables); }, [gqlQuery, memoVariables]);
}
exports.useMemoOperationDescriptor = useMemoOperationDescriptor;
exports.useQuery = function (gqlQuery, variables, options) {
    if (variables === void 0) { variables = {}; }
    if (options === void 0) { options = {}; }
    var environment = useRelayEnvironment_1.useRelayEnvironment();
    var query = useMemoOperationDescriptor(gqlQuery, variables);
    var queryFetcher = useQueryFetcher_1.useQueryFetcher();
    return queryFetcher.execute(environment, query, options);
};
