define(["require", "exports", "../utils/logger"], function (require, exports, logger_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //#endregion
    var ShortcutInputObject = (function () {
        function ShortcutInputObject(name) {
            this.name = name;
        }
        return ShortcutInputObject;
    }());
    var ShortCutController = (function () {
        //#endregion
        /**
         * init Constructor of Shortcut Controller
         * @param element element of the List View Controller
         */
        function ShortCutController(element) {
            var _this = this;
            this.rootNameSpace = "";
            this.shortcutObject = [];
            //#endregion
            //#region shortcutOverride
            this._shortcutOverride = [];
            this.logger.debug("Constructor ShortCutController", "");
            this.element = element;
            //#region Setting default values of q2gShortcut
            if (typeof this.shortcutPreventdefault === "undefined") {
                this.shortcutPreventdefault = true;
            }
            if (typeof this.shortcutRootscope === "undefined") {
                this.shortcutRootscope = "|local|";
            }
            if (typeof this.shortcutTriggerHandler === "undefined") {
                this.shortcutTriggerHandler = "";
            }
            if (typeof this.shortcutAction === "undefined") {
                for (var i = 0; i < this.shortcutObject.length; i++) {
                    this.shortcutObject[i].action = "";
                    if (this.shortcutTriggerHandler = "") {
                        this.shortcutTriggerHandler = "focus";
                    }
                }
            }
            if (this.shortcutObject && typeof this.shortcut === "string") {
                this.shortcutObject[0].preventdefault = this.shortcutPreventdefault;
                this.shortcutObject[0].rootscope = this.shortcutRootscope;
            }
            //#endregion
            this.keyDownFunction = function (e) {
                _this.keydownHandler(e);
            };
            if (this.shortcut) {
                $(document).on("keydown", this.keyDownFunction);
            }
        }
        Object.defineProperty(ShortCutController.prototype, "shortcutOverride", {
            get: function () {
                return this._shortcutOverride;
            },
            set: function (value) {
                if (value !== this._shortcutOverride) {
                    try {
                        this._shortcutOverride = value;
                        this.shortcutObject = this.implementOverriceShortcuts(this.shortcutObject, value);
                    }
                    catch (e) {
                        this.logger.error("error in Setter of shortcutOverride", e);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShortCutController.prototype, "shortcut", {
            get: function () {
                return this._shortcut;
            },
            set: function (value) {
                if (this._shortcut !== value) {
                    try {
                        this._shortcut = value;
                        if (typeof value === "object" && value[0].shortcut) {
                            var assitsVal = value;
                            this.shortcutObject = [];
                            for (var i = 0; i < value.length; i++) {
                                this.shortcutObject.push(this.checksShortcutProperties(value[i]));
                            }
                        }
                        else if (typeof value === "string") {
                            if (!this.shortcutObject || this.shortcutObject.length === 0) {
                                this.shortcutObject = [];
                                this.shortcutObject.push(new ShortcutInputObject("Default"));
                                this.shortcutObject[0].shortcut = value;
                            }
                            else {
                                this.shortcutObject[0].shortcut = value;
                            }
                        }
                    }
                    catch (e) {
                        this.logger.error("Error in SETTER of q2gShortcut", e);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShortCutController.prototype, "logger", {
            get: function () {
                if (!this._logger) {
                    try {
                        this._logger = new logger_1.Logging.Logger("ShortCutController");
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
        Object.defineProperty(ShortCutController.prototype, "shortcutPreventdefault", {
            get: function () {
                return this._shortcutPreventdefault;
            },
            set: function (value) {
                if (value !== this.shortcutPreventdefault && this.shortcut) {
                    try {
                        if (!this.shortcutObject || this.shortcutObject.length === 0) {
                            this.shortcutObject = [];
                            this.shortcutObject.push(new ShortcutInputObject("Default"));
                            this.shortcutObject[0].preventdefault = value;
                        }
                        else {
                            this.shortcutObject[0].preventdefault = value;
                        }
                        this._shortcutPreventdefault = value;
                    }
                    catch (e) {
                        this.logger.error("ERROR in SETTER of q2gShortcutPreventdefault", e);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShortCutController.prototype, "shortcutRootscope", {
            get: function () {
                return this._shortcutRootscope;
            },
            set: function (value) {
                if (value !== this.shortcutRootscope && this.shortcut) {
                    try {
                        if (!this.shortcutObject || this.shortcutObject.length === 0) {
                            this.shortcutObject = [];
                            this.shortcutObject.push(new ShortcutInputObject("Default"));
                            this.shortcutObject[0].rootscope = value;
                        }
                        else {
                            this.shortcutObject[0].rootscope = value;
                        }
                        this._shortcutRootscope = value;
                    }
                    catch (e) {
                        this.logger.error("ERROR in SETTER of q2gShortcutRootscope", e);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * checks the Shortcut Object and set default values
         * @param value shortcut object to be checked for default
         */
        ShortCutController.prototype.checksShortcutProperties = function (value) {
            var assistShortcutInputObject = new ShortcutInputObject(value.name);
            assistShortcutInputObject.shortcut = value.shortcut.toString();
            assistShortcutInputObject.rootscope = "|local|";
            if (typeof value.rootscope !== "undefined") {
                assistShortcutInputObject.rootscope = value.rootscope;
            }
            assistShortcutInputObject.preventdefault = true;
            if (typeof value.preventdefault !== "undefined") {
                assistShortcutInputObject.preventdefault = value.preventdefault;
            }
            assistShortcutInputObject.action = "";
            if (typeof value.action !== "undefined") {
                assistShortcutInputObject.action = value.action;
            }
            assistShortcutInputObject.triggerHandler = "";
            if (typeof value.triggerHandler !== "undefined") {
                assistShortcutInputObject.triggerHandler = value.triggerHandler;
            }
            return assistShortcutInputObject;
        };
        /**
         * merges two arrays
         * @param rootArray
         * @param override
         */
        ShortCutController.prototype.implementOverriceShortcuts = function (rootArray, override) {
            var newArray = [];
            for (var _i = 0, rootArray_1 = rootArray; _i < rootArray_1.length; _i++) {
                var x = rootArray_1[_i];
                for (var _a = 0, override_1 = override; _a < override_1.length; _a++) {
                    var y = override_1[_a];
                    if (y.name && y.shortcut && x.name === y.name) {
                        var assistObj = this.checksShortcutProperties(y);
                        x.name = assistObj.name;
                        x.shortcut = assistObj.shortcut;
                        x.action = y.action ? assistObj.action : x.action;
                        x.preventdefault = y.preventdefault ? assistObj.preventdefault : x.preventdefault;
                        x.rootscope = y.rootscope ? assistObj.rootscope : x.rootscope;
                    }
                }
                newArray.push(x);
            }
            return newArray;
        };
        /**
         * löscht die beziehungen der Events vom scope
         */
        ShortCutController.prototype.$onDestroy = function () {
            this.logger.debug("Function onDestroy", "");
            try {
                $(document).unbind("keydown", this.keyDownFunction);
            }
            catch (e) {
                this.logger.error("ERROR in function $onDestroy", e);
            }
        };
        /**
         * Handler function to bind on keydown
         * @param event Keybordevent for keydown
         * @param global definition, if handler is fired on local or global
         */
        ShortCutController.prototype.keydownHandler = function (event) {
            this.logger.debug("Function keyDownHandler", this.shortcutObject);
            for (var _i = 0, _a = this.shortcutObject; _i < _a.length; _i++) {
                var shortcut = _a[_i];
                if (this.checkShortcutsEqual(this.getArrayInsertetShortcut(shortcut.shortcut), this.getArrayKeydownShortcut(event))) {
                    if (shortcut.preventdefault) {
                        try {
                            event.preventDefault();
                        }
                        catch (e) {
                            this.logger.error("error in keydownHandler", e);
                        }
                    }
                    if (shortcut.rootscope === "|global|") {
                        this.runAction(shortcut);
                    }
                    else if (this.checkParentForFocus(this.element, shortcut.rootscope)) {
                        this.runAction(shortcut, event);
                    }
                }
            }
        };
        /**
         * checks if Action is predefined, otherwise run q2gShortcutAction
         * @param object selected Shortcut Object
         */
        ShortCutController.prototype.runAction = function (objectShortcut, event) {
            this.logger.debug("Function runAction", objectShortcut);
            try {
                if (objectShortcut.triggerHandler !== "") {
                    this.element.triggerHandler(objectShortcut.triggerHandler);
                }
                if (typeof this.shortcutAction !== "undefined") {
                    this.shortcutAction({
                        objectShortcut: {
                            objectShortcut: objectShortcut,
                            element: this.element,
                            event: event,
                        },
                    });
                }
            }
            catch (e) {
                this.logger.error("ERROR in function runAction", e);
            }
        };
        /**
         * check if child element of Root element has focus
         * @param element element of the List View Controller
         * @param rootscope the root scope the function should look for
         */
        ShortCutController.prototype.checkParentForFocus = function (element, rootscope) {
            this.logger.debug("Function checkParentForFocus", "");
            try {
                var lastElement = null;
                var maxCount = 100;
                var foundNode = false;
                for (var i = 0; i < maxCount; i++) {
                    var elem = element.parent()[0].attributes;
                    if (element.parent().is(document) || element === lastElement) {
                        return false;
                    }
                    for (var j = 0; j < elem.length; j++) {
                        if (!foundNode && rootscope === "|local|" &&
                            elem[j].name === "q2g-" + this.rootNameSpace.toLowerCase() + "-shortcut-scope") {
                            foundNode = true;
                            if (element.parent().find(":focus").length > 0) {
                                return true;
                            }
                        }
                        if (elem[j].value === rootscope && element.parent().find(":focus").length > 0) {
                            return true;
                        }
                    }
                    element = element.parent();
                }
                return false;
            }
            catch (e) {
                this.logger.error("Error in checkParentForFocus", e);
            }
            return false;
        };
        /**
         * checks the two arrays for a match
         * @param array1 Shortcut array one
         * @param array2 Shortcut array two
         * @returns returns boolean depending on equality
         */
        ShortCutController.prototype.checkShortcutsEqual = function (array1, array2) {
            this.logger.debug("Function checkShortcutsEqual", "");
            try {
                return array1.sort().join("|") === array2.sort().join("|");
            }
            catch (e) {
                this.logger.error("Error in function checkShortcutsEqual", e);
            }
        };
        /**
         * Creates an Array of Strings from the Shortcut inserted shortcut. The insertet Shortcut gets split on the "+" sign
         * @param shortcut schortcut to be converted into an array
         * @returns returns a Array of strings of the insertet shortcut
         */
        ShortCutController.prototype.getArrayInsertetShortcut = function (shortcut) {
            this.logger.debug("Function getArrayInsertetShortcut", "");
            try {
                var arr = [];
                arr = shortcut.split("+");
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].trim();
                }
                return arr;
            }
            catch (e) {
                this.logger.error("ERROR in function getArrayInsertetShortcut", e);
            }
        };
        /**
         * Creates an Array from keybort input from user
         * @param e the jQuery event to be handled
         */
        ShortCutController.prototype.getArrayKeydownShortcut = function (e) {
            this.logger.debug("Function getArrayKeydownShortcut", "");
            try {
                var arr = [];
                if (e.key.length >= 1) {
                    arr.push(e.keyCode.toString());
                    if (e.ctrlKey) {
                        arr.push("strg");
                    }
                    if (e.altKey) {
                        arr.push("alt");
                    }
                    if (e.shiftKey) {
                        arr.push("shift");
                    }
                }
                return arr;
            }
            catch (e) {
                this.logger.error("ERROR in function getArrayKeydownShortcut", e);
            }
        };
        ShortCutController.$inject = ["$element"];
        return ShortCutController;
    }());
    function ShortCutDirectiveFactory(rootNameSpace) {
        "use strict";
        return function () {
            return {
                restrict: "A",
                replace: true,
                controller: ["$element", ShortCutController],
                controllerAs: "vmShortcut",
                scope: {},
                bindToController: {
                    shortcut: "<",
                    shortcutRootscope: "<?",
                    shortcutAction: "&?",
                    shortcutPreventdefault: "<?",
                    shortcutOverride: "<?",
                    shortcutTriggerHandler: "<?"
                },
                link: function (scope) {
                    scope.vmShortcut.rootNameSpace = rootNameSpace;
                }
            };
        };
    }
    exports.ShortCutDirectiveFactory = ShortCutDirectiveFactory;
});
//# sourceMappingURL=shortcut.js.map