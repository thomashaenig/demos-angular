define(["require", "exports", "../utils/logger", "../filter/statusFilter", "./shortcut", "../utils/utils", "text!./listview.html", "css!./listview.css"], function (require, exports, logger_1, statusFilter_1, shortcut_1, utils_1, template) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ListViewController = (function () {
        /**
         * init of List View Controller
         * @param timeout angular timeout, to maual trigger dom events
         * @param element element of the List View Controller
         */
        function ListViewController(timeout, element) {
            this.hasFocusSearchField = false;
            this.ieItemsReadable = false;
            this.itemsCount = 0;
            this.readingText = "";
            this.showFocused = false;
            this.showScrollBar = false;
            //#endregion
            //#region itemFocused
            this._itemFocused = -1;
            this.element = element;
            this.timeout = timeout;
            this.ieItemsReadable = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        }
        ListViewController.prototype.$onInit = function () {
            this.logger.debug("initial Run of ListViewController");
        };
        Object.defineProperty(ListViewController.prototype, "logger", {
            get: function () {
                if (!this._logger) {
                    try {
                        this._logger = new logger_1.Logging.Logger("ListViewController");
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
        Object.defineProperty(ListViewController.prototype, "itemFocused", {
            get: function () {
                return this._itemFocused;
            },
            set: function (value) {
                if (value !== this.itemFocused && this.element) {
                    this.calcSelected(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * calculates the new selected Positiion. Focus will will be set out of bounds (root div Element)
         * when the the selectet Value is less then 0 and heigher then the max value
         * @param newPos new Position of the selected Element
         */
        ListViewController.prototype.calcSelected = function (newPos) {
            this.logger.debug("function calcSelected", "");
            if (newPos !== this._itemFocused) {
                if (newPos < 0 || newPos >= this.itemsCount) {
                    return;
                }
                else if (newPos < this.itemsPageTop || newPos > this.itemsPageTop + this.itemsPageHeight) {
                    try {
                        this.element.focus();
                    }
                    catch (e) {
                        this.logger.error("ERROR in calcSelected (else if block)", e);
                    }
                }
                else {
                    try {
                        var childs = this.element.children().children().children();
                        var blurChild = childs[this.calcFocusedPosition(this.itemFocused)];
                        if (blurChild) {
                            blurChild.blur();
                        }
                        var focusChild = childs[this.calcFocusedPosition(newPos)];
                        if (focusChild) {
                            focusChild.focus();
                            this.readingText = focusChild.innerHTML;
                        }
                    }
                    catch (e) {
                        this.logger.error("ERROR in calcSelected (else block)", e);
                    }
                }
                this._itemFocused = newPos;
                this.timeout();
            }
        };
        /**
         * calculates the relative Position (on the Data Page) for the selected element
         * @param absolutPosition the absolut position of the focused Item
         * @returns calculated number for the focused Position
         */
        ListViewController.prototype.calcFocusedPosition = function (itemFocused) {
            return itemFocused - this.itemsPageTop;
        };
        /**
         * manage all shortcut events on this directive
         * @param objectShortcut element which is returned from the shortcut directive
         */
        ListViewController.prototype.shortcutHandler = function (objectShortcut) {
            this.logger.debug("function shortcutHandler", objectShortcut);
            var assist = 0;
            switch (objectShortcut.objectShortcut.name) {
                case "up":
                    this.itemFocused++;
                    return true;
                case "down":
                    this.itemFocused--;
                    return true;
                case "pageUp":
                    try {
                        this.itemsPageTop += this.itemsPageHeight;
                        if (this.itemFocused >= this.itemsPageTop - this.itemsPageHeight && this.itemFocused <= this.itemsPageTop) {
                            if (this.itemFocused + this.itemsPageHeight >= this.itemsCount) {
                                this.itemFocused = this.itemsCount;
                            }
                            else {
                                this.itemFocused += this.itemsPageHeight;
                            }
                        }
                        this.timeout();
                        return true;
                    }
                    catch (e) {
                        this.logger.error("Error in shortcutHandler pageUp", e);
                    }
                case "pageDown":
                    try {
                        this.itemsPageTop -= this.itemsPageHeight;
                        if (this.itemFocused >= this.itemsPageTop + this.itemsPageHeight && this.itemFocused <= this.itemsPageTop + this.itemsPageHeight * 2) {
                            if (this.itemFocused - this.itemsPageHeight < 0) {
                                this.itemFocused = 0;
                            }
                            else {
                                this.itemFocused -= this.itemsPageHeight;
                            }
                        }
                        this.timeout();
                        return true;
                    }
                    catch (e) {
                        this.logger.error("Error in shortcutHandler pageDown", e);
                    }
                case "enter":
                    this.callbackListviewObjects({ pos: this.itemFocused - this.itemsPageTop });
                    return true;
                case "enterAll":
                    this.callbackListviewObjects({ pos: this.itemFocused - this.itemsPageTop, event: objectShortcut.event });
                    return true;
            }
            return false;
        };
        /**
         * assist function to change the class of a list element when this is in focus
         * @param index Position in the list
         * @returns checks if element on the position Index has the focus
         */
        ListViewController.prototype.hasFocus = function (index) {
            try {
                return (this.itemFocused - this.itemsPageTop === index);
            }
            catch (err) {
                return false;
            }
        };
        //#endregion
        ListViewController.$inject = ["$timeout", "$element"];
        return ListViewController;
    }());
    function ListViewDirectiveFactory(rootNameSpace) {
        "use strict";
        return function ($document, $injector, $registrationProvider) {
            return {
                restrict: "E",
                replace: true,
                template: utils_1.templateReplacer(template, rootNameSpace),
                controller: ListViewController,
                controllerAs: "vm",
                scope: {},
                bindToController: {
                    items: "<",
                    itemsCount: "=",
                    itemsPageTop: "=",
                    itemsPageHeight: "<",
                    itemHeight: "=",
                    itemFocused: "=",
                    showFocused: "<",
                    callbackListviewObjects: "&",
                    overrideShortcuts: "<?"
                },
                compile: function () {
                    utils_1.checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, shortcut_1.ShortCutDirectiveFactory, "Shortcut");
                    $registrationProvider.filter("qstatusfilter", statusFilter_1.qStatusFilter);
                }
            };
        };
    }
    exports.ListViewDirectiveFactory = ListViewDirectiveFactory;
    ;
});
//# sourceMappingURL=listview.js.map