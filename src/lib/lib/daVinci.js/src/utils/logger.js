define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Logging;
    (function (Logging) {
        var KV = (function () {
            function KV() {
            }
            return KV;
        }());
        var LogConfig = (function () {
            function LogConfig() {
            }
            LogConfig.GetLogLevel = function (name) {
                for (var _i = 0, _a = this.logLevelperClass; _i < _a.length; _i++) {
                    var t = _a[_i];
                    if (t.key === name || t.key === "*") {
                        return t.value;
                    }
                }
                return LogLevel.off;
            };
            LogConfig.SetLogLevel = function (name, level) {
                this.logLevelperClass.push({ key: name, value: level });
            };
            LogConfig.logLevelperClass = new Array();
            return LogConfig;
        }());
        Logging.LogConfig = LogConfig;
        function GetCurrentClassLogger() {
            return new Logger(this.constructor.name);
        }
        Logging.GetCurrentClassLogger = GetCurrentClassLogger;
        var LogLevel;
        (function (LogLevel) {
            LogLevel[LogLevel["trace"] = 0] = "trace";
            LogLevel[LogLevel["debug"] = 1] = "debug";
            LogLevel[LogLevel["info"] = 2] = "info";
            LogLevel[LogLevel["warn"] = 3] = "warn";
            LogLevel[LogLevel["error"] = 4] = "error";
            LogLevel[LogLevel["fatal"] = 5] = "fatal";
            LogLevel[LogLevel["off"] = 6] = "off";
        })(LogLevel = Logging.LogLevel || (Logging.LogLevel = {}));
        var Logger = (function () {
            function Logger(name) {
                this.logclass = name;
            }
            /**
             * Log a Message with a certain loglevel to the browser console if the global filter allows that seetin
             *
             * @param loglevel the minimum loglevelt (e.g. trace, debug, info, warn, error, fatal, off)
             * @param text the message text
             * @param obj a object to log to the console
             */
            Logger.prototype.log = function (loglevel, text) {
                var arrObj = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    arrObj[_i - 2] = arguments[_i];
                }
                if (typeof arrObj !== "undefined") {
                    while (arrObj instanceof Array && arrObj.length < 2) {
                        if (arrObj.length === 1) {
                            arrObj = arrObj[0];
                        }
                        else {
                            arrObj = undefined;
                        }
                    }
                }
                if (LogConfig.GetLogLevel(this.logclass) <= loglevel) {
                    var message = "Log (" + loglevel.toString() + "): " + this.logclass + " - " + text + " - ";
                    switch (loglevel) {
                        case LogLevel.trace:
                            console.trace(message, arrObj);
                            break;
                        case LogLevel.debug:
                            console.debug(message, arrObj);
                            break;
                        case LogLevel.info:
                            console.info(message, arrObj);
                            break;
                        case LogLevel.warn:
                            console.warn(message, arrObj);
                            break;
                        case LogLevel.error:
                            console.error(message, arrObj);
                            break;
                        case LogLevel.fatal:
                            console.error(message, arrObj);
                            break;
                        default:
                            console.trace(message, arrObj);
                    }
                }
            };
            Logger.prototype.trace = function (text) {
                var arrObj = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    arrObj[_i - 1] = arguments[_i];
                }
                this.log(LogLevel.trace, text, arrObj);
            };
            Logger.prototype.debug = function (text) {
                var arrObj = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    arrObj[_i - 1] = arguments[_i];
                }
                this.log(LogLevel.debug, text, arrObj);
            };
            Logger.prototype.info = function (text) {
                var arrObj = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    arrObj[_i - 1] = arguments[_i];
                }
                this.log(LogLevel.info, text, arrObj);
            };
            Logger.prototype.warn = function (text) {
                var arrObj = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    arrObj[_i - 1] = arguments[_i];
                }
                this.log(LogLevel.warn, text, arrObj);
            };
            Logger.prototype.error = function (text) {
                var arrObj = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    arrObj[_i - 1] = arguments[_i];
                }
                this.log(LogLevel.error, text, arrObj);
            };
            Logger.prototype.fatal = function (text) {
                var arrObj = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    arrObj[_i - 1] = arguments[_i];
                }
                this.log(LogLevel.fatal, text, arrObj);
            };
            return Logger;
        }());
        Logging.Logger = Logger;
    })(Logging = exports.Logging || (exports.Logging = {}));
});
//# sourceMappingURL=logger.js.map