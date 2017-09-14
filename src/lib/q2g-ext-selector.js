/// <reference path="lib/daVinci.js/src/utils/utils.ts" />
define(["require", "exports", "qvangular", "text!./q2g-ext-selector.html", "text!./translate/de-DE/propertypanel.js", "text!./translate/en-US/propertypanel.js", "./lib/daVinci.js/src/utils/logger", "./q2g-ext-selectorDirective", "./lib/daVinci.js/src/utils/utils", "./lib/daVinci.js/src/services/translate", "./lib/daVinci.js/src/services/registration", "css!./q2g-ext-selector.css"], function (require, exports, qvangular, template, langDE, langEN, logger_1, q2g_ext_selectorDirective_1, utils_1, translate_1, registration_1) {
    "use strict";
    //#endregion
    qvangular.service("$translateProvider", translate_1.TranslateProvider)
        .translations("en", langEN)
        .translations("de", langDE)
        .determinePreferredLanguage();
    var $translate = qvangular.service("$translate", translate_1.TranslateService);
    qvangular.service("$registrationProvider", registration_1.RegistrationProvider)
        .implementObject(qvangular);
    //#region Logger
    logger_1.Logging.LogConfig.SetLogLevel("*", logger_1.Logging.LogLevel.info);
    var logger = new logger_1.Logging.Logger("Main");
    //#endregion
    //#region Directives
    var $injector = qvangular.$injector;
    utils_1.checkDirectiveIsRegistrated($injector, qvangular, "", q2g_ext_selectorDirective_1.SelectionsDirectiveFactory("Selectionextension"), "SelectionExtension");
    //#endregion
    //#region assist classes
    var parameter = {
        type: "items",
        component: "accordion",
        items: {
            dimensions: {
                uses: "dimensions"
            },
            settings: {
                uses: "settings",
                items: {
                    accessibility: {
                        type: "items",
                        label: $translate.instant("properties.accessibility"),
                        grouped: true,
                        items: {
                            shortcuts: {
                                type: "items",
                                lable: "shortcuts",
                                grouped: false,
                                items: {
                                    ShortcutLable: {
                                        label: "In the following, you can change the used shortcuts",
                                        component: "text"
                                    },
                                    shortcutUseDefaults: {
                                        ref: "properties.shortcutUseDefaults",
                                        label: "use default shortcuts",
                                        component: "switch",
                                        type: "boolean",
                                        options: [{
                                                value: true,
                                                label: "use"
                                            }, {
                                                value: false,
                                                label: "not use"
                                            }],
                                        defaultValue: true
                                    },
                                    shortcutFocusDimensionList: {
                                        ref: "properties.shortcutFocusDimensionList",
                                        label: "focus dimension list",
                                        type: "string",
                                        defaultValue: "strg + alt + 70",
                                        show: function (data) {
                                            if (data.properties.shortcutUseDefaults) {
                                                data.properties.shortcutFocusDimensionList = "strg + alt + 70";
                                            }
                                            return !data.properties.shortcutUseDefaults;
                                        }
                                    },
                                    shortcutFocusSearchField: {
                                        ref: "properties.shortcutFocusSearchField",
                                        label: "focus search field",
                                        type: "string",
                                        defaultValue: "strg + alt + 83",
                                        show: function (data) {
                                            if (data.properties.shortcutUseDefaults) {
                                                data.properties.shortcutFocusSearchField = "strg + alt + 83";
                                            }
                                            return !data.properties.shortcutUseDefaults;
                                        }
                                    },
                                    shortcutFocusValueList: {
                                        ref: "properties.shortcutFocusValueList",
                                        label: "focus value list",
                                        type: "string",
                                        defaultValue: "strg + alt + 87",
                                        show: function (data) {
                                            if (data.properties.shortcutUseDefaults) {
                                                data.properties.shortcutFocusValueList = "strg + alt + 87";
                                            }
                                            return !data.properties.shortcutUseDefaults;
                                        }
                                    },
                                    shortcutClearSelection: {
                                        ref: "properties.shortcutClearSelection",
                                        label: "delete selction",
                                        type: "string",
                                        defaultValue: "strg + alt + 76",
                                        show: function (data) {
                                            if (data.properties.shortcutUseDefaults) {
                                                data.properties.shortcutClearSelection = "strg + alt + 76";
                                            }
                                            return !data.properties.shortcutUseDefaults;
                                        }
                                    }
                                }
                            },
                            arialive: {
                                type: "items",
                                lable: "arialive",
                                grouped: false,
                                items: {
                                    configLable: {
                                        label: "In the following, you can change Settings",
                                        component: "text"
                                    },
                                    useAccessibility: {
                                        ref: "properties.useAccessibility",
                                        label: "use accessibility",
                                        component: "switch",
                                        type: "boolean",
                                        options: [{
                                                value: true,
                                                label: "use"
                                            }, {
                                                value: false,
                                                label: "not use"
                                            }],
                                        defaultValue: false
                                    },
                                    timeAria: {
                                        ref: "properties.timeAria",
                                        label: "Timeinterval for hints",
                                        type: "string",
                                        defaultValue: "7000",
                                        show: function (data) {
                                            return data.properties.useAccessibility;
                                        }
                                    },
                                    actionDelay: {
                                        ref: "properties.actionDelay",
                                        label: "Delay bevor action (used for Aria Live Regions)",
                                        type: "string",
                                        defaultValue: "100",
                                        show: function (data) {
                                            return data.properties.useAccessibility;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    //#endregion
    var SelectionExtension = (function () {
        function SelectionExtension(enigmaRoot) {
            logger.debug("Constructor of Selection Extension", "");
            this.engineRoot = enigmaRoot;
        }
        return SelectionExtension;
    }());
    return {
        definition: parameter,
        initialProperties: {},
        template: template,
        controller: ["$scope", function (scope) {
                logger.debug("Initialice Extension");
                scope.vm = new SelectionExtension(utils_1.getEnigma(scope));
            }]
    };
});
//# sourceMappingURL=q2g-ext-selector.js.map