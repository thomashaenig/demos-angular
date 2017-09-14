define(["require", "exports", "./logger"], function (require, exports, logger_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //#endregion
    //#region Logger 
    var logger = new logger_1.Logging.Logger("utils");
    //#endregion
    // check if can be deleted
    var SimplifierDefinitionObject = (function () {
        function SimplifierDefinitionObject(rootDef) {
            //#region variables
            this.properties = [];
            var rootList = Object.getOwnPropertyNames(rootDef.definition);
            this.getObjectsRec(rootList, rootDef.definition, "definition");
        }
        //#endregion variables
        /**
         * recorsive function to generate relevant Object Properties(ref and defaultValue)
         * @param objectArr Array of stringified Property names
         * @param object object of which the property names where stringified
         * @param propName search string for the ref definition of properties
         */
        SimplifierDefinitionObject.prototype.getObjectsRec = function (objectArr, object, propName) {
            try {
                for (var i = 0; i < objectArr.length; i++) {
                    if (typeof object[objectArr[i]] === "object") {
                        var assistList = Object.getOwnPropertyNames(object[objectArr[i]]);
                        this.getObjectsRec(assistList, object[objectArr[i]], objectArr[i]);
                    }
                    else if (objectArr[i] === "ref" && object.defaultValue) {
                        var assistObject = {
                            defaultValue: object.defaultValue,
                            ref: object.ref
                        };
                        this.properties.push(assistObject);
                    }
                }
            }
            catch (e) {
                console.error("error in function getObjectsRec", e);
            }
        };
        /**
         * returns the value of the property in dependency of the insertet link
         * @param property the relevant enigma Properties of the object
         * @param link the ref string of the object
         * @param forceDefault use default value or not
         */
        SimplifierDefinitionObject.prototype.getPropertyValue = function (property, link, forceDefault) {
            try {
                var arrLink = [];
                arrLink = link.split(".");
                var assistObjectProperties = property;
                for (var i = 0; i < this.properties.length; i++) {
                    if (this.properties[i].ref === link && forceDefault) {
                        return this.properties[i].defaultValue;
                    }
                    else if (this.properties[i].ref === link) {
                        for (var j = 0; j < arrLink.length; j++) {
                            assistObjectProperties = assistObjectProperties[arrLink[j]];
                        }
                        return assistObjectProperties;
                    }
                }
            }
            catch (e) {
                console.error("error in function getPropertyValue", e);
            }
        };
        return SimplifierDefinitionObject;
    }());
    exports.SimplifierDefinitionObject = SimplifierDefinitionObject;
    /**
     * replace and creates namespace for the directives in the templates, to ensure multiple use of directives
     * @param template basic template for the directive
     * @param rootNameSpace naming of the extension, to ensure multiple use of directives
     */
    function templateReplacer(template, rootNameSpace) {
        var newTemplate = template.replace(/([< /]q2g\-)|(\nq2g\-)/g, function (a, b, c) {
            if (c) {
                return c + rootNameSpace + "-";
            }
            return b + rootNameSpace + "-";
        });
        return newTemplate;
    }
    exports.templateReplacer = templateReplacer;
    /**
     * check and replace additional characters
     * @param string
     */
    function regEscaper(string) {
        return string.replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&");
    }
    exports.regEscaper = regEscaper;
    /**
     * checks if Directiv is already registrated
     * @param injector
     * @param qvangular
     * @param rootNameSpace
     * @param factory
     * @param directiveName
     */
    function checkDirectiveIsRegistrated(injector, regDirective, rootNameSpace, factory, directiveName) {
        try {
            if (!injector.has("q2g" + rootNameSpace + directiveName)) {
                logger.trace("load missing q2g" + rootNameSpace + directiveName);
                regDirective.directive("q2g" + rootNameSpace + directiveName, factory);
            }
        }
        catch (e) {
            console.error("Error in checkForExistingDirective", e);
        }
    }
    exports.checkDirectiveIsRegistrated = checkDirectiveIsRegistrated;
    var AssistHypercube = (function () {
        //#endregion
        function AssistHypercube(rootCube) {
            this.calcCube = [];
            //#region searchString
            this._searchString = "";
            this.rootCube = rootCube;
            this.searchListObjectFor("");
        }
        Object.defineProperty(AssistHypercube.prototype, "searchString", {
            get: function () {
                return this._searchString;
            },
            set: function (value) {
                if (value !== this.searchString) {
                    this._searchString = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        AssistHypercube.prototype.getListObjectData = function (string, qPages) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                try {
                    resolve(_this.calcCube.slice(qPages[0].qTop, qPages[0].qTop + qPages[0].qHeight));
                }
                catch (e) {
                    console.error("Error in getListObjectData", e);
                    reject(e);
                }
            });
        };
        AssistHypercube.prototype.searchListObjectFor = function (qMatch) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                try {
                    var assistElement_1 = qMatch
                        .replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&")
                        .replace(/\*/g, ".*");
                    if (_this.rootCube.qBookmarkList) {
                        _this.calcCube = _this.rootCube.qBookmarkList.qItems.filter(function (element) {
                            if (element.qMeta.title.match(new RegExp(assistElement_1, "i"))) {
                                return element;
                            }
                        });
                    }
                    else if (_this.rootCube.qHyperCube) {
                        _this.calcCube = _this.rootCube.qHyperCube.qDimensionInfo.filter(function (element) {
                            if (element.qGroupFieldDefs[0].match(new RegExp(assistElement_1, "i"))) {
                                return element;
                            }
                        });
                    }
                    resolve(true);
                }
                catch (e) {
                    console.error("Error in seachListObjectData", e);
                    reject(e);
                }
            });
        };
        return AssistHypercube;
    }());
    exports.AssistHypercube = AssistHypercube;
    /**
     * calculates the number of Visible Rows
     */
    function calcNumbreOfVisRows(elementHeight) {
        try {
            return Math.floor((elementHeight - 42) / 32.5);
        }
        catch (err) {
            logger.error("ERROR in calc Number of vis roes", err);
        }
    }
    exports.calcNumbreOfVisRows = calcNumbreOfVisRows;
    /**
     * gets the enigmaRoot for the different Qlik Versions
     * @param scope root angular scoop for the Directive
     * @returns returns the enigma root Object
     */
    function getEnigma(scope) {
        var enigmaRoot = scope.component.model;
        if (scope.component.model.enigmaModel) {
            // pre 3.2 SR3 enigma is in a subvariable of model
            enigmaRoot = scope.component.model.enigmaModel;
        }
        return enigmaRoot;
    }
    exports.getEnigma = getEnigma;
    /**
     * checks if two arrays are equal
     * @param array1
     * @param array2
     */
    function checkEqualityOfArrays(array1, array2) {
        logger.debug("Function checkEqualityOfArrays", "");
        try {
            if (array1 && array2 && array1.length !== array2.length) {
                return false;
            }
            if (array1 && array2) {
                for (var i = 0; i < array1.length; i++) {
                    if (JSON.stringify(array1[i]).indexOf(JSON.stringify(array2[i])) === -1) {
                        return false;
                    }
                }
            }
            return true;
        }
        catch (e) {
            logger.error("Error in function checkEqualityOfArrays", e);
            return true;
        }
    }
    exports.checkEqualityOfArrays = checkEqualityOfArrays;
    function sort(a, b) {
        if (a.id > b.id) {
            return 1;
        }
        if (a.id < b.id) {
            return -1;
        }
        // a muss gleich b sein
        return 0;
    }
});
//# sourceMappingURL=utils.js.map