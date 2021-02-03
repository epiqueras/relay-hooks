"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var QueryFetcher_1 = require("./QueryFetcher");
// set query when you want suspends
exports.useQueryFetcher = function (query) {
    var _a = react_1.useState(null), forceUpdate = _a[1];
    var ref = react_1.useRef();
    if (ref.current === null || ref.current === undefined) {
        ref.current = {
            queryFetcher: QueryFetcher_1.getOrCreateQueryFetcher(query, forceUpdate),
        };
    }
    //const { queryFetcher } = ref.current;
    react_1.useEffect(function () {
        return function () { return ref.current.queryFetcher.dispose(); };
    }, []);
    return ref.current.queryFetcher;
};
