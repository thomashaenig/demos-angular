define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TranslateProvider = (function () {
        function TranslateProvider() {
        }
        TranslateProvider.prototype.determinePreferredLanguage = function (fn) {
            var userLang = navigator.language || navigator.userLanguage;
            if (userLang === undefined)
                userLang = "";
            this.preferredLanguage(userLang);
            return this;
        };
        TranslateProvider.prototype.preferredLanguage = function (language) {
            if (language) {
                TranslateProvider.preferredLanguage = language;
                return this;
            }
            return TranslateProvider.preferredLanguage;
        };
        TranslateProvider.prototype.translations = function (key, translationTable) {
            if (translationTable !== undefined) {
                TranslateProvider.translationTable[key] = translationTable;
                return this;
            }
            return TranslateProvider.translationTable[key];
        };
        TranslateProvider.translationTable = {};
        return TranslateProvider;
    }());
    exports.TranslateProvider = TranslateProvider;
    exports.TranslateService = ((function ($q, $translateProvider) {
        // init für Translation
        var NameLess = function (translationId, interpolateParams, interpolationId) {
            return new $q(function (resolve, reject) {
                var result = NameLess.instant(translationId, interpolateParams, interpolationId);
                resolve(result);
            });
        };
        NameLess.instant = function (translationId, interpolateParams, interpolationId) {
            try {
                return $translateProvider.translations($translateProvider.preferredLanguage())[translationId];
                ;
            }
            catch (err) {
                return translationId;
            }
        };
        return NameLess;
    }));
});
//# sourceMappingURL=translate.js.map