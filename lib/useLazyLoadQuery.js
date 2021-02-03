"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var useQuery_1 = require("./useQuery");
var useQueryFetcher_1 = require("./useQueryFetcher");
var useRelayEnvironment_1 = require("./useRelayEnvironment");
exports.useLazyLoadQuery = function (gqlQuery, variables, options) {
    if (variables === void 0) { variables = {}; }
    if (options === void 0) { options = {}; }
    var environment = useRelayEnvironment_1.useRelayEnvironment();
    var query = useQuery_1.useMemoOperationDescriptor(gqlQuery, variables);
    var queryFetcher = useQueryFetcher_1.useQueryFetcher(query);
    return queryFetcher.execute(environment, query, options);
};
