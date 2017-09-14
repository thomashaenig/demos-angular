define(["require", "exports", "../utils/logger", "text!./identifier.html", "../utils/utils", "css!./identifier.css"], function (require, exports, logger_1, template, utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //#endregion
    var IdentifierController = (function () {
        //#endregion
        /**
         * init of AkquinetIdentifierController
         */
        function IdentifierController() {
            this.logger.debug("init Constructor", this);
        }
        IdentifierController.prototype.$onInit = function () {
            this.logger.debug("initial Run of AkquinetIdentifierController");
        };
        Object.defineProperty(IdentifierController.prototype, "logger", {
            get: function () {
                if (!this._logger) {
                    try {
                        this._logger = new logger_1.Logging.Logger("IdentifierController");
                    }
                    catch (e) {
                        this.logger.error("ERROR in create logger instance", e);
                    }
                }
                return this._logger;
            },
            enumerable: true,
            configurable: true
        });
        return IdentifierController;
    }());
    function IdentifierDirectiveFactory(rootNameSpace) {
        "use strict";
        return function ($document, $injector) {
            return {
                restrict: "E",
                replace: true,
                template: utils.templateReplacer(template, rootNameSpace),
                controller: IdentifierController,
                controllerAs: "vm",
                scope: {},
                bindToController: {
                    show: "<"
                }
            };
        };
    }
    exports.IdentifierDirectiveFactory = IdentifierDirectiveFactory;
    ;
});
//# sourceMappingURL=identifier.js.map