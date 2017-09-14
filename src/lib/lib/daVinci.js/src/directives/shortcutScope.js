define(["require", "exports", "../utils/logger"], function (require, exports, logger_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //#endregion
    var ShortCutScopeController = (function () {
        function ShortCutScopeController() {
        }
        ShortCutScopeController.prototype.$onInit = function () {
            this.logger.debug("initial Run of ScrollBarController");
        };
        Object.defineProperty(ShortCutScopeController.prototype, "logger", {
            get: function () {
                if (!this._logger) {
                    try {
                        this._logger = new logger_1.Logging.Logger("ShortCutScopeController");
                    }
                    catch (e) {
                        console.error("Error in initialising Logger", e);
                    }
                }
                return this._logger;
            },
            enumerable: true,
            configurable: true
        });
        ShortCutScopeController.$inject = ["$element"];
        return ShortCutScopeController;
    }());
    //#region Shortcut
    exports.ShortCutScopeDirectiveFactory = function () {
        return {
            restrict: "A",
            replace: true,
            controller: ["$element", ShortCutScopeController]
        };
    };
});
//#endregion 
//# sourceMappingURL=shortcutScope.js.map