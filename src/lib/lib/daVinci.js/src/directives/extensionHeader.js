define(["require", "exports", "../utils/logger", "../utils/utils", "./shortcut", "./searchBar", "text!./extensionHeader.html", "css!./extensionHeader.css"], function (require, exports, logger_1, utils_1, shortcut_1, searchBar_1, template) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //#endregion
    //#region Logger
    var logger = new logger_1.Logging.Logger("q2g menuDirective");
    //#endregion
    var ListElement = (function () {
        function ListElement() {
            this.type = "";
            this.isVisible = false;
            this.isEnabled = false;
            this.icon = "";
            this.hasSeparator = false;
        }
        return ListElement;
    }());
    var ExtensionHeaderController = (function () {
        /**
         * init of List View Controller
         * @param element element of the List View Controller
         * @param scope scope element to get the watcher in class
         */
        function ExtensionHeaderController(timeout, element, scope) {
            var _this = this;
            this.popOverWidth = 0;
            this.reservedButtonWidth = 0.5;
            this.showPopoverMenu = false;
            this.showSearchField = false;
            this.displayList = [];
            this.popOverList = [];
            //#endregion
            //#region showButtons
            this._showButtons = false;
            this.element = element;
            this.timeout = timeout;
            this.popOverWidth = element.width();
            scope.$watch(function () {
                return _this.element.width();
            }, function () {
                _this.calcLists();
            });
        }
        ExtensionHeaderController.prototype.$onInit = function () {
            logger.debug("initial Run of MainMenuController");
        };
        Object.defineProperty(ExtensionHeaderController.prototype, "showButtons", {
            get: function () {
                return this._showButtons;
            },
            set: function (value) {
                if (this.showButtons != value) {
                    this._showButtons = value;
                    if (!value) {
                        this.showPopoverMenu = false;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtensionHeaderController.prototype, "menuList", {
            get: function () {
                return this._menuList;
            },
            set: function (value) {
                if (this._menuList !== value) {
                    try {
                        this._menuList = value;
                        this.listRefactoring(value);
                    }
                    catch (e) {
                        logger.error("Error in setter of menuList");
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        /**
         * refactors the insertet List
         * @param value list to be refactored
         */
        ExtensionHeaderController.prototype.listRefactoring = function (value) {
            this.menuListRefactored = [];
            try {
                for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                    var x = value_1[_i];
                    var assistElement = new ListElement();
                    assistElement.hasSeparator = x.hasSeparator ? x.hasSeparator : assistElement.hasSeparator;
                    assistElement.icon = x.icon ? x.icon : assistElement.icon;
                    assistElement.isEnabled = x.isEnabled ? x.isEnabled : assistElement.isEnabled;
                    assistElement.isVisible = x.isVisible ? x.isBisible : assistElement.isVisible;
                    assistElement.name = x.name ? x.name : assistElement.name;
                    assistElement.type = x.type ? x.type : assistElement.type;
                    this.menuListRefactored.push(assistElement);
                }
            }
            catch (e) {
                logger.error("error in listRefactoring", e);
            }
        };
        /**
         * calculates the two lists for displaying
         */
        ExtensionHeaderController.prototype.calcLists = function () {
            var numberOfVisibleElements = (this.element.width() * this.reservedButtonWidth) / 60;
            var counter = 0;
            this.displayList = [];
            this.popOverList = [];
            try {
                for (var _i = 0, _a = this.menuListRefactored; _i < _a.length; _i++) {
                    var x = _a[_i];
                    counter++;
                    if (counter < this.maxNumberOfElements && counter < numberOfVisibleElements) {
                        this.displayList.unshift(x);
                    }
                    else {
                        this.popOverList.push(x);
                    }
                }
            }
            catch (e) {
                logger.error("error in calcLists", e);
            }
        };
        //#endregion
        ExtensionHeaderController.$inject = ["$timeout", "$element", "$scope"];
        return ExtensionHeaderController;
    }());
    function ExtensionHeaderDirectiveFactory(rootNameSpace) {
        "use strict";
        return function ($document, $injector, $registrationProvider) {
            return {
                restrict: "E",
                replace: true,
                template: utils_1.templateReplacer(template, rootNameSpace),
                controller: ExtensionHeaderController,
                controllerAs: "vm",
                scope: {},
                bindToController: {
                    menuList: "<",
                    maxNumberOfElements: "<",
                    reservedButtonWidth: "<",
                    callbackMainMenuButton: "&",
                    textSearch: "=",
                    showButtons: "=",
                    showSearchField: "=",
                    title: "<",
                    shortcutSearchfield: "<",
                },
                compile: function () {
                    utils_1.checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, searchBar_1.SearchBarDirectiveFactory(rootNameSpace), "SearchBar");
                    utils_1.checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, shortcut_1.ShortCutDirectiveFactory, "Shortcut");
                }
            };
        };
    }
    exports.ExtensionHeaderDirectiveFactory = ExtensionHeaderDirectiveFactory;
});
//# sourceMappingURL=extensionHeader.js.map