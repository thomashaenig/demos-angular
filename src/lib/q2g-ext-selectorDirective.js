define(["require", "exports", "./lib/daVinci.js/src/utils/logger", "./lib/daVinci.js/src/directives/listview", "./lib/daVinci.js/src/directives/scrollBar", "./lib/daVinci.js/src/directives/statusText", "./lib/daVinci.js/src/directives/extensionHeader", "./lib/daVinci.js/src/directives/shortcut", "./lib/daVinci.js/src/directives/identifier", "./lib/daVinci.js/src/utils/object", "./lib/daVinci.js/src/utils/utils", "text!./q2g-ext-selectorDirective.html"], function (require, exports, logger_1, listview_1, scrollBar_1, statusText_1, extensionHeader_1, shortcut_1, identifier_1, object_1, utils, template) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //#endregion
    //#region Logger
    var logger = new logger_1.Logging.Logger("q2g-ext-selectorDrective");
    //#endregion
    //#region assist classes
    var ListsInformation = (function () {
        function ListsInformation() {
            this.maxNumberOfRows = 0;
            this.numberOfVisibleRows = 0;
        }
        return ListsInformation;
    }());
    var DataModel = (function () {
        function DataModel() {
            this.dimensionList = [];
            this.dimensionListBackup = [];
            this.valueList = [];
        }
        return DataModel;
    }());
    //#endregion
    var SelectionsController = (function () {
        /**
         * init of the controller for the Direction Directive
         * @param timeout
         * @param element
         */
        function SelectionsController(timeout, element, scope) {
            var _this = this;
            this.scope = scope;
            this.timeAriaIntervall = 0;
            this.actionDelay = 100;
            this.properties = {
                shortcutFocusDimensionList: " ",
                shortcutFocusSearchField: " ",
                shortcutFocusValueList: " ",
                shortcutClearSelection: " ",
            };
            this.useReadebility = false;
            this.titleDimension = "Dimensions";
            this.titleValues = "no Dimension Selected";
            this.showFocusedValue = false;
            this.showFocusedDimension = false;
            this.showSearchFieldDimension = false;
            this.showSearchFieldValues = false;
            this.selectedDimensionDefs = [];
            this.selectedDimension = "";
            //#endregion
            //#region elementHeight
            this._elementHeight = 0;
            //#endregion
            //#region focusedPositionDimension
            this._focusedPositionDimension = -1;
            //#endregion
            //#region focusedPositionValues
            this._focusedPositionValues = -1;
            //#endregion
            //#region textSearchDimension Promise Row needs to be changed !!!!
            this._textSearchDimension = "";
            //#endregion
            //#region textSearchValue
            this._textSearchValue = "";
            //#endregion
            //#region showButtonsDimension
            this._showButtonsDimension = false;
            //#endregion
            //#region showButtonsValue
            this._showButtonsValue = false;
            this.element = element;
            this.timeout = timeout;
            this.initMenuElements();
            $(document).on("click", function (e) {
                try {
                    if (element.children().children().children().children(".dimensionList").find(e.target).length === 0) {
                        _this.showFocusedDimension = false;
                        _this.showButtonsDimension = false;
                        _this.showSearchFieldDimension = false;
                        _this.timeout();
                    }
                    if (element.children().children().children().children(".valueList").find(e.target).length === 0) {
                        _this.showFocusedValue = false;
                        _this.showButtonsValue = false;
                        _this.showSearchFieldValues = false;
                        _this.timeout();
                    }
                }
                catch (e) {
                    logger.error("Error in Constructor with click event", e);
                }
            });
            scope.$watch(function () {
                return _this.element.width();
            }, function () {
                _this.elementHeight = _this.element.height();
            });
        }
        SelectionsController.prototype.$onInit = function () {
            logger.debug("initial Run of SelectionsController");
        };
        Object.defineProperty(SelectionsController.prototype, "engineroot", {
            get: function () {
                return this._engineroot;
            },
            set: function (value) {                
                if (value !== this._engineroot) {
                    try {
                        logger.info("val", value);
                        this._engineroot = value;
                        var that_1 = this;
                        this.engineroot.on("changed", function () {
                            this.getLayout().then(function (res) {
                                that_1.getProperties(res.properties);
                                if (!that_1.dimensionList) {
                                    that_1.dimensionList = new object_1.Q2gListAdapter(new object_1.Q2gDimensionObject(new utils.AssistHypercube(res)), utils.calcNumbreOfVisRows(that_1.elementHeight), res.qHyperCube.qDimensionInfo.length);
                                    console.log("CHANGE ENGINE");
                                    this_1.timeout();
                                }
                                else {
                                    that_1.dimensionList.updateList(new object_1.Q2gDimensionObject(new utils.AssistHypercube(res)), utils.calcNumbreOfVisRows(that_1.elementHeight), res.qHyperCube.qDimensionInfo.length);
                                }
                            });
                        });
                        this.engineroot.emit("changed");
                    }
                    catch (e) {
                        logger.error("error", e);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionsController.prototype, "elementHeight", {
            get: function () {
                return this._elementHeight;
            },
            set: function (value) {
                var _this = this;
                if (this.elementHeight !== value) {
                    try {
                        this._elementHeight = value;
                        if (this.dimensionList) {
                            this.dimensionList.obj.emit("changed", utils.calcNumbreOfVisRows(this.elementHeight));
                        }
                        else {
                            this.timeout(function () {
                                _this.dimensionList.obj.emit("changed", utils.calcNumbreOfVisRows(_this.elementHeight));
                            }, 200);
                        }
                        if (this.valueList && this.valueList.obj) {
                            this.valueList.obj.emit("changed", utils.calcNumbreOfVisRows(this.elementHeight));
                        }
                    }
                    catch (err) {
                        console.error("error in setter of elementHeight", err);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionsController.prototype, "focusedPositionDimension", {
            get: function () {
                return this._focusedPositionDimension;
            },
            set: function (newVal) {
                var _this = this;
                if (newVal !== this._focusedPositionDimension) {
                    if (this._focusedPositionValues !== -1) {
                        this.dimensionList.itemsPagingTopSetPromise(this.calcPagingStart(newVal, this.dimensionList.itemsPagingTop, this.dimensionList))
                            .then(function () {
                            _this._focusedPositionDimension = newVal;
                        })
                            .catch(function (e) {
                            logger.error("ERROR in Setter of absolutPosition");
                        });
                        return;
                    }
                    this._focusedPositionDimension = newVal;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionsController.prototype, "focusedPositionValues", {
            get: function () {
                return this._focusedPositionValues;
            },
            set: function (newVal) {
                var _this = this;
                if (newVal !== this._focusedPositionValues && this.valueList) {
                    if (this._focusedPositionValues !== -1) {
                        if (newVal >= this.valueList.itemsPagingTop &&
                            newVal <= this.valueList.itemsPagingTop + this.valueList.itemsPagingHeight - 1) {
                            this._focusedPositionValues = newVal;
                        }
                        else {
                            this.valueList.itemsPagingTopSetPromise(this.calcPagingStart(newVal, this.focusedPositionValues, this.valueList))
                                .then(function () {
                                _this._focusedPositionValues = newVal;
                            })
                                .catch(function (e) {
                                logger.error("ERROR in Setter of absolutPosition");
                            });
                            return;
                        }
                    }
                    this._focusedPositionValues = newVal;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionsController.prototype, "textSearchDimension", {
            get: function () {
                return this._textSearchDimension;
            },
            set: function (value) {
                var _this = this;
                if (value !== this.textSearchDimension) {
                    try {
                        this._textSearchDimension = value;
                        if (!value) {
                            this.dimensionList.obj.searchFor("").then(function () {
                                _this.dimensionList.obj.emit("changed", utils.calcNumbreOfVisRows(_this.elementHeight));
                                _this.dimensionList.itemsCounter = _this.dimensionList.obj.model.calcCube.length;
                                _this.timeout();
                            });
                            return;
                        }
                        this.dimensionList.itemsPagingTop = 0;
                        this.dimensionList.obj.searchFor(value).then(function () {
                            _this.dimensionList.obj.emit("changed", utils.calcNumbreOfVisRows(_this.elementHeight));
                            _this.dimensionList.itemsCounter = _this.dimensionList.obj.model.calcCube.length;
                            _this.timeout();
                        });
                    }
                    catch (err) {
                        logger.error("error in setter of textSearchValue", err);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionsController.prototype, "textSearchValue", {
            get: function () {
                return this._textSearchValue;
            },
            set: function (value) {
                var _this = this;
                if (value !== this.textSearchValue) {
                    try {
                        this.valueList.itemsPagingTop = 0;
                        this._textSearchValue = value;
                        if (!value) {
                            this.valueList.obj.searchFor("").then(function () {
                                return _this.engineGenericObjectVal.getLayout();
                            }).then(function (res) {
                                _this.valueList.itemsCounter = res.qListObject.qDimensionInfo.qCardinal;
                            }).catch(function (e) {
                                logger.error("ERROR in Setter of textSearchValue", e);
                            });
                            return;
                        }
                        this.valueList.itemsPagingTop = 0;
                        this.valueList.obj.searchFor(value).then(function () {
                            return _this.engineGenericObjectVal.getLayout();
                        }).then(function (res) {
                            _this.valueList.itemsCounter = res.qListObject.qDimensionInfo.qCardinal;
                        }).catch(function (e) {
                            logger.error("ERROR in Setter of textSearchValue", e);
                        });
                    }
                    catch (err) {
                        logger.error("error in setter of textSearchValue");
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionsController.prototype, "showButtonsDimension", {
            get: function () {
                return this._showButtonsDimension;
            },
            set: function (value) {
                if (this._showButtonsDimension !== value) {
                    this._showButtonsDimension = value;
                    if (value) {
                        this.showButtonsValue = false;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionsController.prototype, "showButtonsValue", {
            get: function () {
                return this._showButtonsValue;
            },
            set: function (value) {
                if (this._showButtonsValue !== value) {
                    this._showButtonsValue = value;
                    if (value) {
                        this.showButtonsDimension = false;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * fills the Menu with Elements
         */
        SelectionsController.prototype.initMenuElements = function () {
            this.menuListDimension = [];
            this.menuListValues = [];
            this.menuListValues.push({
                type: "success",
                isVisible: true,
                isEnabled: true,
                icon: "tick",
                name: "Confirm Selection",
                hasSeparator: false,
            });
            this.menuListValues.push({
                type: "danger",
                isVisible: true,
                isEnabled: false,
                icon: "close",
                name: "Cancle Selection",
                hasSeparator: true
            });
            this.menuListValues.push({
                type: "",
                isVisible: true,
                isEnabled: true,
                icon: "clear-selections",
                name: "clear",
                hasSeparator: false
            });
            this.menuListValues.push({
                type: "",
                isVisible: true,
                isEnabled: true,
                icon: "select-all",
                name: "Select all",
                hasSeparator: false
            });
            this.menuListValues.push({
                type: "",
                isVisible: true,
                isEnabled: false,
                icon: "select-possible",
                name: "Select possible",
                hasSeparator: false
            });
            this.menuListValues.push({
                type: "",
                isVisible: true,
                isEnabled: true,
                icon: "select-alternative",
                name: "Select alternative",
                hasSeparator: false
            });
            this.menuListValues.push({
                type: "",
                isVisible: true,
                isEnabled: true,
                icon: "select-excluded",
                name: "Select excluded",
                hasSeparator: false
            });
        };
        /**
         * function which gets called, when the buttons of the menu list gets hit
         * @param item neme of the nutton which got activated
         */
        SelectionsController.prototype.menuListActionCallback = function (item) {
            switch (item) {
                case "accept":
                    this.showButtonsValue = false;
                    this.showSearchFieldValues = false;
                    this.engineGenericObjectVal.endSelections(true);
                    break;
                case "cancel":
                    this.showButtonsValue = false;
                    this.showSearchFieldValues = false;
                    this.engineGenericObjectVal.endSelections(false);
                    break;
                case "clear":
                    this.engineGenericObjectVal.clearSelections("/qListObjectDef");
                    break;
                case "Select all":
                    this.engineGenericObjectVal.selectListObjectAll("/qListObjectDef");
                    break;
                case "Select possible":
                    this.engineGenericObjectVal.selectListObjectPossible("/qListObjectDef");
                    break;
                case "Select alternative":
                    this.engineGenericObjectVal.selectListObjectAlternative("/qListObjectDef");
                    break;
                case "Select excluded":
                    this.engineGenericObjectVal.selectListObjectExcluded("/qListObjectDef");
                    break;
            }
        };
        /**
         * creates a new session object for the selected dimension
         * @param pos position of the selected extension in the displayed list
         */
        SelectionsController.prototype.selectDimensionObjectCallback = function (pos) {
            var _this = this;
            logger.debug("function selectDimensionObjectCallback", "");
            try {
                if (this.selectedDimension !== this.dimensionList.collection[pos].title) {
                    console.log("TEST - 2")
                    setTimeout(function () {
                        _this.showFocusedDimension = true;
                        for (var _i = 0, _a = _this.dimensionList.collection; _i < _a.length; _i++) {
                            var x = _a[_i];
                            x.status = "A";
                        }
                        // dimension
                        _this.selectedDimension = _this.dimensionList.collection[pos].title;
                        _this.selectedDimensionDefs = _this.dimensionList.collection[pos].defs;
                        _this.focusedPositionDimension = pos + _this.dimensionList.itemsPagingTop;
                        _this.dimensionList.collection[pos].status = "S";
                        // values
                        _this.valueList = null;
                        _this._focusedPositionValues = 0;
                        _this.createValueListSessionObjcet(_this.selectedDimension, _this.selectedDimensionDefs);
                        _this.textSearchValue = "";
                        _this.titleValues = _this.dimensionList.collection[pos].title;
                        // others
                        _this.statusText = "Dimension " + _this.dimensionList.collection[pos].title + " gewählt";
                        _this.timeout();
                    }, this.actionDelay);
                }
            }
            catch (err) {
                logger.error("ERROR in selectDimension", err);
            }
        };
        /**
         * callback when selecting Value in the value List
         * @param pos position from the selected Value
         */
        SelectionsController.prototype.selectListObjectCallback = function (pos, event) {
            var _this = this;
            var assistItemsPagingTop = this.valueList.itemsPagingTop;
            setTimeout(function () {
                _this.showFocusedValue = true;
                _this.showButtonsValue = true;
                _this.engineGenericObjectVal.selectListObjectValues("/qListObjectDef", [_this.valueList.collection[pos].id], (event && event.ctrlKey) ? false : true)
                    .then(function () {
                    _this.focusedPositionValues = pos + _this.valueList.itemsPagingTop;
                    _this.valueList.itemsPagingTop = assistItemsPagingTop;
                    _this.statusText = "Dimension " + _this.valueList.collection[pos].title + " gewählt";
                }).catch(function (err) {
                    logger.error("ERROR in selectListObjectCallback", err);
                });
            }, this.actionDelay);
        };
        /**
         * creates the session object for the selected dimension by dimension name
         * @param dimensionName name of the diminsion the new session object should be create for
         */
        SelectionsController.prototype.createValueListSessionObjcet = function (dimensionName, dimensionFieldDefs) {
            var _this = this;
            if (this.engineGenericObjectVal) {
                this.engineroot.app.destroySessionObject(this.engineGenericObjectVal.id)
                    .then(function () {
                    _this.createValueListSessionObjectAssist(dimensionName, dimensionFieldDefs);
                })
                    .catch(function (err) {
                    logger.error("Error in createValueListSessionObjcet", err);
                });
            }
            else {
                this.createValueListSessionObjectAssist(dimensionName, dimensionFieldDefs);
            }
        };
        /** TO DO vorhandener list Object den Feldwert ändern -> folgend muss alles sich von alleine neuberechne
         * creates the session object for the selected dimension by dimension name assist
         * @param dimensionName name of the diminsion the new session object should be create for
         * @param dimensionFieldDefs definition of the diminsion the new session object should be create for
         */
        SelectionsController.prototype.createValueListSessionObjectAssist = function (dimensionName, dimensionFieldDefs) {
            var _this = this;
            var parameter = {
                "qInfo": {
                    "qType": "ListObject"
                },
                "qListObjectDef": {
                    "qStateName": "$",
                    "qLibraryId": "",
                    "qDef": {
                        "qFieldDefs": dimensionFieldDefs,
                        "qGrouping": "N",
                        "autoSort": false,
                        "qActiveField": 0,
                        "qFieldLabels": [dimensionName],
                        "qSortCriterias": [{
                                "qSortByState": 1,
                                "qSortByAscii": 1
                            }]
                    },
                    "qAutoSortByState": {
                        "qDisplayNumberOfRows": -1
                    },
                    "qFrequencyMode": "EQ_NX_FREQUENCY_NONE",
                    "qShowAlternatives": true,
                    "qInitialDataFetch": [
                        {
                            "qTop": 0,
                            "qLeft": 0,
                            "qHeight": 0,
                            "qWidth": 1
                        }
                    ]
                },
                "description": "Description of the list object"
            };
            this.engineroot.app.createSessionObject(parameter)
                .then(function (genericObject) {
                _this.engineGenericObjectVal = genericObject;
                genericObject.getLayout().then(function (res) {
                    _this.valueList = new object_1.Q2gListAdapter(new object_1.Q2gListObject(genericObject), utils.calcNumbreOfVisRows(_this.elementHeight), res.qListObject.qDimensionInfo.qCardinal);
                    var that = _this;
                    genericObject.on("changed", function () {
                        that.valueList.obj.emit("changed", utils.calcNumbreOfVisRows(that.elementHeight));
                    });
                    genericObject.emit("changed");
                });
            })
                .catch(function (err) {
                logger.error("ERROR", err);
            });
        };
        /**
         * calculates the new Paging Start Position when absolut position is out of Paging size
         * @param newVal the new Value of the focusedPosition
         * @param focusedPosition the old value of the focusedPosition
         * @param object the list object, in which the changes shoud be done
         */
        SelectionsController.prototype.calcPagingStart = function (newVal, focusedPosition, object) {
            // absolutPosition out of sight below
            if (focusedPosition < object.itemsPagingTop && focusedPosition >= 0) {
                return newVal;
            }
            // absolutPosition out of sight above
            if (focusedPosition > object.itemsPagingTop + utils.calcNumbreOfVisRows(this.elementHeight)) {
                return newVal - utils.calcNumbreOfVisRows(this.elementHeight) + 1;
            }
            // absolutPosition steps out of page below
            if (newVal < object.itemsPagingTop) {
                return object.itemsPagingTop - 1;
            }
            // absolutPosition steps out of page above
            if (newVal >= object.itemsPagingTop + utils.calcNumbreOfVisRows(this.elementHeight)) {
                return object.itemsPagingTop + 1;
            }
            return object.itemsPagingTop;
        };
        /**
         * shortcuthandler to clears the made selection
         * @param objectShortcut object wich gives you the shortcut name and the element, from which the shortcut come from
         */
        SelectionsController.prototype.shortcutHandler = function (objectShortcut) {
            var _this = this;
            logger.debug("function shortcutHandler", objectShortcut.objectShortcut.name);
            switch (objectShortcut.objectShortcut.name) {
                case "focusDimensionList":
                    try {
                        this.showFocusedDimension = true;
                        this.showFocusedValue = false;
                        this.timeout();
                        if (this.focusedPositionDimension < 0) {
                            this.focusedPositionDimension = 0;
                            objectShortcut.element.children().children().children()[0].focus();
                            this.timeout();
                            return true;
                        }
                        if (this.focusedPositionDimension >= this.dimensionList.collection.length) {
                            this.focusedPositionDimension = 0;
                            objectShortcut.element.children().children().children()[0].focus();
                            this.timeout();
                            return true;
                        }
                        if (this.focusedPositionDimension < this.dimensionList.itemsPagingTop) {
                            this.dimensionList.itemsPagingTop = this.focusedPositionDimension;
                        }
                        else if (this.focusedPositionDimension >
                            this.dimensionList.itemsPagingTop + utils.calcNumbreOfVisRows(this.elementHeight)) {
                            this.dimensionList.itemsPagingTop
                                = this.focusedPositionDimension - (utils.calcNumbreOfVisRows(this.elementHeight) + 1);
                        }
                        objectShortcut.element.children().children().children().children()[this.focusedPositionDimension - this.dimensionList.itemsPagingTop].focus();
                        return true;
                    }
                    catch (e) {
                        logger.error("Error in shortcut Handler", e);
                        return false;
                    }
                case "focusSearchDimension":
                    try {
                        this.showFocusedDimension = false;
                        this.timeout();
                        objectShortcut.element.focus();
                        return true;
                    }
                    catch (e) {
                        logger.error("Error in shortcut Handler", e);
                        return false;
                    }
                case "clearselection":
                    this.textSearchDimension = "";
                    this.textSearchValue = "";
                    this.engineroot.app.clearAll(true).then(function () {
                        _this.statusText = "Selektionen wurden gelöscht";
                    }).catch(function (e) {
                        logger.error("error in shortcutHandlerClear", e);
                    });
                    return true;
                case "focusSearchValue":
                    this.showFocusedValue = false;
                    objectShortcut.element.focus();
                    return true;
                case "focusValueList":
                    this.showFocusedDimension = false;
                    this.showFocusedValue = true;
                    this.timeout();
                    if (this.valueList.collection) {
                        if (this.focusedPositionValues < 0 ||
                            this.focusedPositionValues >= this.valueList.collection.length ||
                            this.focusedPositionValues >= utils.calcNumbreOfVisRows(this.elementHeight) + this.valueList.itemsPagingTop) {
                            this.focusedPositionValues = 0;
                            this.valueList.itemsPagingTop = 0;
                            objectShortcut.element.children().children().children().children()[0].focus();
                            this.timeout();
                            return true;
                        }
                        if (this.focusedPositionValues < this.valueList.itemsPagingTop) {
                            this.valueList.itemsPagingTop = this.focusedPositionValues;
                        }
                        else if (this.focusedPositionValues > this.valueList.itemsPagingTop + utils.calcNumbreOfVisRows(this.elementHeight)) {
                            this.valueList.itemsPagingTop = this.focusedPositionValues - (utils.calcNumbreOfVisRows(this.elementHeight) + 1);
                        }
                        objectShortcut.element.children().children().children().children()[this.focusedPositionValues - this.valueList.itemsPagingTop].focus();
                    }
                    return true;
                case "escape":
                    if (this.textSearchDimension.length > 0 || this.textSearchValue.length > 0) {
                        if (objectShortcut.element.parent().find(":focus").length > 0) {
                            switch (objectShortcut.element[0].getAttribute("ng-model")) {
                                case "vm.textSearchDimension":
                                    this.textSearchDimension = "";
                                    break;
                                case "vm.textSearchValue":
                                    this.textSearchValue = "";
                                    break;
                            }
                        }
                        else {
                            objectShortcut.element.blur();
                        }
                    }
                    return true;
                case "acceptSearch":
                    setTimeout(function () {
                        _this.engineGenericObjectVal.acceptListObjectSearch("/qListObjectDef", true)
                            .then(function () {
                            _this.statusText = "Alle gesuchten Werte gewählt";
                        }).catch(function (err) {
                            logger.error("ERROR in selectListObjectCallback", err);
                        });
                    }, this.actionDelay);
                    return true;
                case "escDimension":
                    try {
                        if (this.textSearchDimension === "") {
                            this.showSearchFieldDimension = false;
                        }
                        return true;
                    }
                    catch (e) {
                        logger.error("Error in shortcutHandlerExtensionHeader", e);
                        return false;
                    }
                case "escValues":
                    try {
                        if (this.textSearchValue === "") {
                            this.showSearchFieldValues = false;
                        }
                        return true;
                    }
                    catch (e) {
                        logger.error("Error in shortcutHandlerExtensionHeader", e);
                        return false;
                    }
            }
            return false;
        };
        /**
         * checks if the extension is used in Edit mode
         */
        // SelectionsController.prototype.isEditMode = function () {
        //     if (qlik.navigation.getMode() === "analysis") {
        //         return false;
        //     }
        //     else {
        //         return true;
        //     }
        // }; 
        /**
         * saves the Properties from the getLayout call from qlik enine in own Object
         * @param properties Properties from getLayout call
         */
        SelectionsController.prototype.getProperties = function (properties) {
            this.properties.shortcutFocusDimensionList = properties.shortcutFocusDimensionList;
            this.properties.shortcutFocusValueList = properties.shortcutFocusValueList;
            this.properties.shortcutFocusSearchField = properties.shortcutFocusSearchField;
            this.properties.shortcutClearSelection = properties.shortcutClearSelection;
            if (properties.useAccessibility) {
                this.timeAriaIntervall = parseInt(properties.timeAria, 10);
                this.actionDelay = parseInt(properties.actionDelay, 10);
            }
            this.useReadebility = properties.useAccessibility;
        };
        //#endregion
        SelectionsController.$inject = ["$timeout", "$element", "$scope"];
        return SelectionsController;
    }());
    function SelectionsDirectiveFactory(rootNameSpace) {
        "use strict";
        return function ($document, $injector, $registrationProvider) {
            return {
                restrict: "E",
                replace: true,
                template: utils.templateReplacer(template, rootNameSpace),
                controller: SelectionsController,
                controllerAs: "vm",
                scope: {},
                bindToController: {
                    engineroot: "<"
                },
                compile: function () {
                    utils.checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, listview_1.ListViewDirectiveFactory(rootNameSpace), "Listview");
                    utils.checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, scrollBar_1.ScrollBarDirectiveFactory(rootNameSpace), "ScrollBar");
                    utils.checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, statusText_1.StatusTextDirectiveFactory(rootNameSpace), "StatusText");
                    utils.checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, shortcut_1.ShortCutDirectiveFactory(rootNameSpace), "Shortcut");
                    utils.checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, identifier_1.IdentifierDirectiveFactory(rootNameSpace), "AkquinetIdentifier");
                    utils.checkDirectiveIsRegistrated($injector, $registrationProvider, rootNameSpace, extensionHeader_1.ExtensionHeaderDirectiveFactory(rootNameSpace), "ExtensionHeader");
                }
            };
        };
    }
    exports.SelectionsDirectiveFactory = SelectionsDirectiveFactory;
});
//# sourceMappingURL=q2g-ext-selectorDirective.js.map