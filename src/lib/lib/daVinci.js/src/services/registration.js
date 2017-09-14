define(["require", "exports", "../utils/logger"], function (require, exports, logger_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //#endregion
    //#region Logger
    var logger = new logger_1.Logging.Logger("Main");
    var RegistrationProvider = (function () {
        function RegistrationProvider() {
        }
        RegistrationProvider.prototype.implementObject = function (object) {
            this.directive = object.directive ? object.directive : null;
            this.filter = object.filter ? object.filter : null;
            this.service = object.service ? object.service : null;
            if (!this.directive && this.filter && this.service) {
                logger.error("object with missing properties inserted", object);
            }
        };
        return RegistrationProvider;
    }());
    exports.RegistrationProvider = RegistrationProvider;
});
//# sourceMappingURL=registration.js.map