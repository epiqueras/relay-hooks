"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var areEqual = require("fbjs/lib/areEqual");
var relay_runtime_1 = require("relay-runtime");
var QueryFetcher_1 = require("./QueryFetcher");
var Utils_1 = require("./Utils");
exports.internalLoadQuery = function (promise, queryExecute) {
    if (promise === void 0) { promise = false; }
    if (queryExecute === void 0) { queryExecute = function (queryFetcher, environment, query, options, retain) { return queryFetcher.execute(environment, query, options, retain); }; }
    var data = null;
    var listener = undefined;
    var queryFetcher = new QueryFetcher_1.QueryFetcher(true);
    var prev = {
        environment: null,
        gqlQuery: null,
        variables: null,
        options: null,
        query: null,
    };
    var dispose = function () {
        queryFetcher.dispose();
        queryFetcher = new QueryFetcher_1.QueryFetcher(true);
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
            prev.query = Utils_1.createOperation(gqlQuery, prev.variables);
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
        if (relay_runtime_1.isPromise(data)) {
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
exports.loadLazyQuery = function () {
    return exports.internalLoadQuery(true);
};
exports.loadQuery = function () {
    return exports.internalLoadQuery(false);
};
