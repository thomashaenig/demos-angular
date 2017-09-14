var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./logger", "../node_modules/typescript.events/lib/typescript.events", "./utils"], function (require, exports, logger_1, typescript_events_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //#endregion
    //#region Logger
    var logger = new logger_1.Logging.Logger("q2gListAdapter");
    //#endregion
    var Q2gListAdapter = (function () {
        //#endregion
        /**
         * init constructor q2gListAdapter
         * @param obj object with the specific implementation for Values, Dimension, Bookmarks, ...
         * @param itemsPagingHeight number of items visible on Page
         * @param itemsCounter number of items in the whole list
         */
        function Q2gListAdapter(obj, itemsPagingHeight, itemsCounter) {
            //#endregion
            //#region collection
            this._collection = [];
            //#endregion
            //#region itemsPagingHeight
            this._itemsPagingHeight = 0;
            //#endregion
            //#region itemsPagingTop
            this._itemsPagingTop = 0;
            this.obj = obj;
            this.itemsPagingHeight = itemsPagingHeight;
            this.itemsCounter = itemsCounter;
            this.itemsPagingTop = 0;
            this.registrateChangeEvent();
        }
        Object.defineProperty(Q2gListAdapter.prototype, "collection", {
            get: function () {
                return this._collection;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Q2gListAdapter.prototype, "itemsPagingHeight", {
            get: function () {
                return this._itemsPagingHeight;
            },
            set: function (value) {
                if (this.itemsPagingHeight !== value) {
                    try {
                        this._itemsPagingHeight = value;
                        this.callData();
                    }
                    catch (err) {
                        logger.error("error in setter of listDimensionscrollPosition", err);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Q2gListAdapter.prototype, "itemsPagingTop", {
            get: function () {
                return this._itemsPagingTop;
            },
            set: function (value) {
                this.itemsPagingTopSetPromise(value);
            },
            enumerable: true,
            configurable: true
        });
        Q2gListAdapter.prototype.itemsPagingTopSetPromise = function (value) {
            if (this.itemsPagingTop !== value) {
                try {
                    this._itemsPagingTop = value;
                    this.callData();
                }
                catch (err) {
                    logger.error("error in setter of listDimensionscrollPosition", err);
                }
            }
            return new Promise(function (resolve, reject) {
                resolve(true);
            });
        };
        /**
         * writes the new data page in the collection
         */
        Q2gListAdapter.prototype.callData = function () {
            var _this = this;
            logger.debug("callData", "");
            console.log("event ###################");
            this.obj.getDataPage(this.itemsPagingTop, this.itemsPagingHeight)
                .then(function (collection) {
                if (!_this._collection || !utils_1.checkEqualityOfArrays(_this._collection, collection)) {
                    var counter = 0;
                    for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
                        var x = collection_1[_i];
                        if (counter >= _this.collection.length || JSON.stringify(x) !== JSON.stringify(_this._collection[counter])) {
                            _this._collection[counter] = x;
                        }
                        counter++;
                    }
                    _this._collection.splice(counter, _this._collection.length);
                }
            })
                .catch(function (e) {
                logger.error("ERROR in getDataPages", e);
            });
        };
        /**
         * updates teh required parameter for the list
         * @param obj
         * @param itemsPagingHeight
         * @param itemsCounter
         */
        Q2gListAdapter.prototype.updateList = function (obj, itemsPagingHeight, itemsCounter) {
            this.obj = obj;
            this.itemsPagingHeight = itemsPagingHeight;
            this.itemsCounter = itemsCounter;
            this.registrateChangeEvent();
        };
        /**
         * registrates the on change event
         */
        Q2gListAdapter.prototype.registrateChangeEvent = function () {
            var _this = this;
            this.obj.on("changed", function (args) {
                _this.itemsPagingHeight = args;
                _this.callData();
            });
            this.obj.emit("changed", this.itemsPagingHeight);
        };
        return Q2gListAdapter;
    }());
    exports.Q2gListAdapter = Q2gListAdapter;
    var Q2gDimensionObject = (function (_super) {
        __extends(Q2gDimensionObject, _super);
        /**
         * init of class q2gDimensionObject
         * @param model root Connection to the Hypercube
         */
        function Q2gDimensionObject(model) {
            var _this = _super.call(this) || this;
            _this.model = model;
            return _this;
        }
        /**
         * calculates and returns the new datapage
         * @param itemsPagingTop start element for Page
         * @param itemsPagingHeight number of items visible on Page
         */
        Q2gDimensionObject.prototype.getDataPage = function (itemsPagingTop, itemsPagingHeight) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.model.getListObjectData("", [{
                        "qTop": itemsPagingTop,
                        "qLeft": 0,
                        "qHeight": itemsPagingHeight,
                        "qWidth": 1
                    }])
                    .then(function (res) {
                    var collection = [];
                    for (var j = 0; j < res.length; j++) {
                        var matrix = res[j];
                        collection.push({
                            status: matrix.qStateCounts.qSelected,
                            id: matrix.cId,
                            defs: matrix.qGroupFieldDefs,
                            title: matrix.qFallbackTitle,
                        });
                    }
                    resolve(collection);
                })
                    .catch(function (e) {
                    logger.error("ERROR", e);
                    reject(e);
                });
            });
        };
        /**
         * search for the enterd string in the root Object
         * @param searchString string to search for
         */
        Q2gDimensionObject.prototype.searchFor = function (searchString) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.model.searchListObjectFor(searchString)
                    .then(function () {
                    resolve(true);
                }).catch(function (e) {
                    logger.error("error", e);
                    reject();
                });
            });
        };
        return Q2gDimensionObject;
    }(typescript_events_1.Event));
    exports.Q2gDimensionObject = Q2gDimensionObject;
    var Q2gListObject = (function (_super) {
        __extends(Q2gListObject, _super);
        /**
         * init of class q2gDimensionObject
         * @param model root Connection to the Hypercube
         */
        function Q2gListObject(model) {
            var _this = _super.call(this) || this;
            _this.model = model;
            return _this;
        }
        /**
         * calculates and returns the new datapage
         * @param itemsPagingTop start element for Page
         * @param itemsPagingHeight number of items visible on Page
         */
        Q2gListObject.prototype.getDataPage = function (itemsPagingTop, itemsPagingSize) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.model.getListObjectData("/qListObjectDef", [{
                        "qTop": itemsPagingTop,
                        "qLeft": 0,
                        "qHeight": itemsPagingSize,
                        "qWidth": 1
                    }])
                    .then(function (res) {
                    var collection = [];
                    for (var _i = 0, _a = res[0].qMatrix; _i < _a.length; _i++) {
                        var item = _a[_i];
                        var matrix = item[0];
                        collection.push({
                            status: matrix.qState,
                            id: matrix.qElemNumber,
                            title: matrix.qText,
                        });
                    }
                    resolve(collection);
                })
                    .catch(function (e) {
                    logger.error("ERROR", e);
                    reject(e);
                });
            });
        };
        /**
         * search for the enterd string in the root Object
         * @param searchString string to search for
         */
        Q2gListObject.prototype.searchFor = function (searchString) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.model.searchListObjectFor("/qListObjectDef", searchString)
                    .then(function () {
                    resolve(true);
                }).catch(function (e) {
                    logger.error("error", e);
                    reject();
                });
            });
        };
        return Q2gListObject;
    }(typescript_events_1.Event));
    exports.Q2gListObject = Q2gListObject;
});
//# sourceMappingURL=object.js.map