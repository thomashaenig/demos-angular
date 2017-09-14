define(["require", "exports", "../utils/logger", "../utils/utils", "text!./scrollBar.html", "css!./scrollBar.css"], function (require, exports, logger_1, utils_1, template) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //#endregion
    var DragableBar = (function () {
        //#endregion
        /**
         * initial DragableBar
         * @param element requires element in which the Dragable Bar is placed
         */
        function DragableBar(element) {
            this.position = 0;
            this.height = 0;
            this.element = element;
            this.elementDragable = this.element.children().children();
            this.elementDragable[0].style.height = "12px";
            this.elementDragable[0].style.display = "normal";
            this.elementDragable[0].style.top = "0px";
            this.height = element.children().height();
            this.watchResize(40);
        }
        Object.defineProperty(DragableBar.prototype, "logger", {
            get: function () {
                if (!this._logger) {
                    try {
                        this._logger = new logger_1.Logging.Logger("DragableBar");
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
        ;
        /**
         * checks the size of the container and resets it
         * @param intervall intervall of controlling the size
         */
        DragableBar.prototype.watchResize = function (intervall) {
            var _this = this;
            setInterval(function () {
                if (_this.element.children().height() !== _this.height) {
                    try {
                        _this.height = _this.element.children().height();
                    }
                    catch (err) {
                        _this.logger.error("ERROR in watch resize", err);
                    }
                }
            }, intervall);
        };
        /**
         * sets the height of the dragable element of the scroll bar
         * @param height new height of the element
         */
        DragableBar.prototype.setHeight = function (height) {
            try {
                if (height < 12) {
                    this.elementDragable[0].style.height = 12 + "px";
                }
                else {
                    this.elementDragable[0].style.height = height + "px";
                }
                return this.elementDragable[0].style.height;
            }
            catch (e) {
                console.error("Error in class DragableBar by call setHeight");
            }
        };
        /**
         * returns the height of the dragable element
         */
        DragableBar.prototype.getHeight = function () {
            try {
                return +this.elementDragable[0].style.height.replace("px", "");
            }
            catch (err) {
                this.logger.error("ERROR", [err]);
                return 0;
            }
        };
        /**
         * sets the visibility of the Dragable element
         * @param visible new visibility
         */
        DragableBar.prototype.setVisible = function (visible) {
            try {
                this.elementDragable[0].style.display = "flex";
                if (!visible) {
                    this.elementDragable[0].style.display = "none";
                }
                return visible;
            }
            catch (err) {
                this.elementDragable[0].style.display = "none";
                this.logger.error("Error in Class DragableBar", err);
            }
        };
        ;
        /**
         * resets the top position of the element
         * @param posMove delta of the position the dragable bar moves
         */
        DragableBar.prototype.setPosition = function (posMove) {
            try {
                if (isNaN(this.position)) {
                    this.position = 0;
                }
                else if (this.position + posMove < 0) {
                    this.elementDragable[0].style.top = "0px";
                    this.position = 0;
                }
                else if (this.position + posMove > this.height - this.getHeight()) {
                    this.elementDragable[0].style.top = this.height - this.getHeight() + "px";
                    this.position = this.height - this.getHeight();
                }
                else {
                    this.position += posMove;
                    this.elementDragable[0].style.top = this.position + "px";
                }
            }
            catch (err) {
                this.logger.error("ERROR", [err]);
            }
        };
        /**
         * returns the top space as number
         */
        DragableBar.prototype.getTop = function () {
            try {
                return parseInt(this.elementDragable[0].style.top.substring(0, this.elementDragable[0].style.top.length - 2), 10);
            }
            catch (err) {
                this.logger.error("Error in function get Top of class DragableElement", err);
                return 0;
            }
        };
        /**
         * reset height to childreen heigt
         */
        DragableBar.prototype.resetHeight = function () {
            this.height = this.element.children().height();
        };
        return DragableBar;
    }());
    var ScrollBarController = (function () {
        //#endregion
        /**
         * init of the Scroll Bar controller
         * @param $element element in which the ScrollbarController is placed
         * @param $timeout angular timeout, to manual trigger dom events
         */
        function ScrollBarController($element, $timeout) {
            var _this = this;
            //#endregion
            //#region itemsPageTop
            this._itemsPageTop = 0;
            this.element = $element;
            try {
                this.dragElement = this.element.children().children();
            }
            catch (e) {
                this.logger.error("children", e);
            }
            this.dragableBarElement = new DragableBar(this.element);
            this.timeout = $timeout;
            this.element.parent().on("wheel", function (event) {
                _this.scrollWheelHandle(event);
            });
            this.dragElement.on("mousedown", function (event) {
                event.preventDefault();
                var startY = 0;
                var topPositionOfDragElement = 0;
                try {
                    startY = event.screenY;
                    topPositionOfDragElement = parseInt(_this.dragElement[0].style.top.substring(0, _this.dragElement[0].style.top.length - 2), 10);
                }
                catch (err) {
                    _this.logger.error("ERROR", [err]);
                }
                $(document).on("mousemove", function (event) {
                    _this.mousehandle(event, "mousemove", startY, _this.dragableBarElement.getTop() - topPositionOfDragElement);
                });
                $(document).on("mouseup", function (event) {
                    _this.mousehandle(event, "mouseup", startY, _this.dragableBarElement.getTop() - topPositionOfDragElement);
                });
            });
        }
        ScrollBarController.prototype.$onInit = function () {
            this.logger.debug("initial Run of ScrollBarController");
        };
        Object.defineProperty(ScrollBarController.prototype, "itemsPageTop", {
            get: function () {
                return this._itemsPageTop;
            },
            set: function (value) {
                if (this.itemsPageTop !== value) {
                    var oldVal = this.itemsPageTop;
                    try {
                        if (value < 0) {
                            this.itemsPageTop = 0;
                        }
                        else if (value > this.itemsCount - this.itemsPageHeight) {
                            this.itemsPageTop = this.itemsCount - this.itemsPageHeight;
                        }
                        else {
                            this._itemsPageTop = value;
                        }
                        if (this.element) {
                            var newPostion = (this.element.height() - this.dragableBarElement.getHeight()) /
                                (this.itemsCount - this.itemsPageHeight) * (value - oldVal);
                            this.dragableBarElement.setPosition(newPostion);
                        }
                        if (this.timeout) {
                            this.timeout();
                        }
                    }
                    catch (e) {
                        console.error("error in setter startposition", e);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarController.prototype, "itemsCount", {
            get: function () {
                return this._itemsCount;
            },
            set: function (value) {
                if (this.itemsCount !== value) {
                    try {
                        this._itemsCount = value;
                        this.calcDragableBarProperties();
                    }
                    catch (e) {
                        console.error("error in setter itemsvisible", e);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarController.prototype, "itemsPageHeight", {
            get: function () {
                return this._itemsPageHeight;
            },
            set: function (values) {
                if (this.itemsPageHeight !== values) {
                    try {
                        this._itemsPageHeight = values;
                        this.calcDragableBarProperties();
                    }
                    catch (e) {
                        console.error("error in setter itemsvisible", e);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarController.prototype, "logger", {
            get: function () {
                if (!this._logger) {
                    try {
                        this._logger = new logger_1.Logging.Logger("ScrollBarController");
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
        /**
         * calculates the properties (visible and height) IMPORTENT! settimeout needs to be changed
         */
        ScrollBarController.prototype.calcDragableBarProperties = function () {
            var _this = this;
            setTimeout(function () {
                try {
                    _this.dragableBarElement.setVisible(_this.itemsCount > _this.itemsPageHeight);
                    _this.dragableBarElement.setHeight(_this.element.height() * _this.itemsPageHeight / _this.itemsCount);
                }
                catch (err) {
                    _this.logger.error("ERROR in calcDragableBarProperties", err);
                }
            }, 200);
        };
        /**
         * calculates the position of the dragable element by controling with mouse
         * @param event jQuery event which is triggerd
         * @param upOrMove hint if mouse is moved or mouse up
         * @param startY start position of the mouse Movement
         * @param top the top position of the dragable element
         */
        ScrollBarController.prototype.mousehandle = function (event, upOrMove, startY, top) {
            try {
                this.dragableBarElement.setPosition((event.screenY - startY) - top);
                var newPosition = (this.dragableBarElement.getTop() /
                    ((this.element.height() - this.dragableBarElement.getHeight()) / (this.itemsCount - this.itemsPageHeight)));
                this.itemsPageTop = Math.round(newPosition);
                if (upOrMove === "mouseup") {
                    $(document).unbind("mousemove");
                    $(document).unbind("mouseup");
                }
            }
            catch (err) {
                this.logger.error("ERROR in function moushandle", err);
            }
        };
        /**
         * sets the top of the dragable bar when using scroll wheel
         * @param event JQuery event from the scroll wheel
         */
        ScrollBarController.prototype.scrollWheelHandle = function (event) {
            try {
                this.itemsPageTop += event.originalEvent.deltaY / 100;
            }
            catch (err) {
                this.dragableBarElement.setPosition(0);
                this.logger.error("ERROR", err);
            }
        };
        return ScrollBarController;
    }());
    function ScrollBarDirectiveFactory(rootNameSpace) {
        "use strict";
        return function () {
            return {
                restrict: "E",
                replace: true,
                template: utils_1.templateReplacer(template, rootNameSpace),
                controller: ScrollBarController,
                controllerAs: "vm",
                scope: {},
                bindToController: {
                    itemsCount: "<",
                    itemsPageTop: "=",
                    itemsPageHeight: "<",
                    vertical: "<",
                    show: "<"
                }
            };
        };
    }
    exports.ScrollBarDirectiveFactory = ScrollBarDirectiveFactory;
});
//# sourceMappingURL=scrollBar.js.map