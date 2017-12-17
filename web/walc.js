System.register("testlib", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function add(a, b) {
        return a + b;
    }
    exports_1("add", add);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("walc", ["testlib"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var testlib_1;
    return {
        setters: [
            function (testlib_1_1) {
                testlib_1 = testlib_1_1;
            }
        ],
        execute: function () {
            console.log('Hello from WALC:', testlib_1.add(2, 3));
        }
    };
});
//# sourceMappingURL=walc.js.map