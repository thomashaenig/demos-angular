define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Filter to check which selection state is active
     */
    function qStatusFilter() {
        "use strict";
        return function (elementStatus) {
            switch (elementStatus) {
                case "S":
                    return "selected";
                case "A":
                    return "alternative";
                case "O":
                    return "optional";
                case "X":
                    return "excluded";
            }
            return "option";
        };
    }
    exports.qStatusFilter = qStatusFilter;
});
//# sourceMappingURL=statusFilter.js.map