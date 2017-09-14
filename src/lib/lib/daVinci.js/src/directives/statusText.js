define(["require", "exports", "../utils/logger", "../utils/utils", "text!./statusText.html"], function (require, exports, logger_1, utils_1, template) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //#endregion
    var StatusTextController = (function () {
        //#endregion
        /**
         * init for the Status Text Controller
         * @param timeout angular timeout, to maual trigger dom events
         * @param element element of the List View Controller
         */
        function StatusTextController(timeout, element) {
            this.timeout = timeout;
            this.element = element;
            if (!this.statustime) {
                this.statustime = 10000;
            }
        }
        Object.defineProperty(StatusTextController.prototype, "logger", {
            get: function () {
                if (!this._logger) {
                    try {
                        this._logger = new logger_1.Logging.Logger("StatusTextController");
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
        Object.defineProperty(StatusTextController.prototype, "statustext", {
            get: function () {
                return this._statustext;
            },
            set: function (value) {
                var _this = this;
                if (value !== this.statustext) {
                    try {
                        this._statustext = value;
                        // better way would be with angular ng-repeat and an array object, but there is a bug in Jaws 
                        // wich do not read the correct text so following workaround:
                        this.element.prepend("<li class='listElement'>" + this.statustext + "</li>");
                        this.timeout(function () {
                            _this.element.children().remove(":last");
                        }, this.statustime);
                    }
                    catch (e) {
                        this.logger.error("error in SETTER of statustext", e);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * when destroy the element, remove all added elements from dom
         */
        StatusTextController.prototype.$onDestroy = function () {
            try {
                this.element.children().remove();
            }
            catch (e) {
                this.logger.error("Error while destroying the status bar directiv", e);
            }
        };
        StatusTextController.$inject = ["$timeout", "$element"];
        return StatusTextController;
    }());
    function StatusTextDirectiveFactory(rootNameSpace) {
        "use strict";
        return function () {
            return {
                restrict: "E",
                replace: true,
                template: utils_1.templateReplacer(template, rootNameSpace),
                controller: StatusTextController,
                controllerAs: "vm",
                scope: {},
                bindToController: {
                    statustext: "<",
                    statustime: "<?"
                }
            };
        };
    }
    exports.StatusTextDirectiveFactory = StatusTextDirectiveFactory;
});
//# sourceMappingURL=statusText.js.map