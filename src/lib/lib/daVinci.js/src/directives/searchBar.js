define(["require", "exports", "../utils/utils", "../utils/logger", "./shortcut", "text!./searchBar.html"], function (require, exports, utils_1, logger_1, shortcut_1, template) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //#endregion
    //#region Logger
    var logger = new logger_1.Logging.Logger("q2g searchBarDirective");
    //#endregion
    var SearchBarController = (function () {
        /**
         * init of List View Controller
         */
        function SearchBarController(element, scope) {
            this.textSearch = "";
            scope.$watch(function () { return element.is(':visible'); }, function () {
                try {
                    if (element.is(':visible')) {
                        element.children().eq(1).focus();
                    }
                }
                catch (e) {
                    logger.error("error in constructor", e);
                }
            });
        }
        SearchBarController.prototype.$onInit = function () {
            logger.debug("initial Run of SearchBarController");
        };
        //#endregion
        SearchBarController.$inject = ["$element", "$scope"];
        return SearchBarController;
    }());
    function SearchBarDirectiveFactory(rootNameSpace) {
        "use strict";
        return function ($document, $injector, $registrationProvider) {
            return {
                restrict: "E",
                replace: true,
                template: utils_1.templateReplacer(template, rootNameSpace),
                controller: SearchBarController,
                controllerAs: "vm",
                scope: {},
                bindToController: {
                    textSearch: "=",
                    placeholder: "<"
                },
                compile: function () {
                    utils_1.checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, shortcut_1.ShortCutDirectiveFactory, "Shortcut");
                }
            };
        };
    }
    exports.SearchBarDirectiveFactory = SearchBarDirectiveFactory;
});
//# sourceMappingURL=searchBar.js.map