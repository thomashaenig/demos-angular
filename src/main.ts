import { person } from "./person";
import * as angular from "angular";
// import * as Halyard from "halyard.js";
import * as blubird from "bluebird";
import * as enigma from "enigma.js";
import * as WebSocket from "ws";
import * as customMixin from "./customMixin";

const q2g_ext_selectorDirective = require("./lib/selector/src/q2g-ext-selectorDirective");

// let enigmaMixin = require("./node_modules/halyard.js/dist/halyard-enigma-mixin.js");
let qixSchema = require("./node_modules/enigma.js/schemas/12.20.0.json");

let app = angular.module("app",[]);
let providerClass: any = {};

app.config(function (
	$controllerProvider: ng.IControllerProvider,
	$compileProvider: ng.ICompileProvider,
	$filterProvider: ng.IFilterProvider,
	$provide: ng.auto.IProvideService) {
		providerClass = {
			controller: $controllerProvider.register,
			directive: $compileProvider.directive,
			filter: $filterProvider.register,
			factory: $provide.factory,
			service: $provide.service
		};
	}
);

app.service("$registrationProvider", function () {
    return providerClass;
});



class RootCtrl {

	// private halyard: Halyard = new Halyard();
	private enigmaConfig: enigmaJS.IConfig;
	private session: enigmaJS.ISession;
	private app: EngineAPI.IApp;
	private configObject: EngineAPI.IGenericObjectProperties = {
		qInfo: {
			qType: "visualization",
			qId: "",
		},
		type: "q2g-ext-selector",
		labels: true,
		qHyperCubeDef: {
			qDimensions: [{
				qDef: {
					qFieldDefs: ["Is Highlight"],
					qSortCriterias: [{
						qSortByAscii: 1,
					}],
				},
			}, {
				qDef: {
					qFieldDefs: ["Is Public Domain"],
					qSortCriterias: [{
						qSortByAscii: 1,
					}],
				},
			}, {
				qDef: {
					qFieldDefs: ["Title"],
					qSortCriterias: [{
						qSortByAscii: 1,
					}],
				},
			}, {
				qDef: {
					qFieldDefs: ["Medium"],
					qSortCriterias: [{
						qSortByAscii: 1,
					}],
				},
			}, {
				qDef: {
					qFieldDefs: ["Department"],
					qSortCriterias: [{
						qSortByAscii: 1,
					}],
				},
			}, {
				qDef: {
					qFieldDefs: ["Classification"],
					qSortCriterias: [{
						qSortByAscii: 1,
					}],
				},
			}],
			qInitialDataFetch: [{ qTop: 0, qHeight: 0, qLeft: 0, qWidth: 0 }],
			qSuppressZero: false,
			qSuppressMissing: true,

		},
		properties: {
			shortcutFocusDimensionList: "strg + alt + 70",
			shortcutFocusValueList: "strg + alt + 87",
			shortcutFocusSearchField: "strg + alt + 83",
			shortcutClearSelection: "strg + alt + 76"
		}
	};
	public engineRoot: any;
	public test: string = "Hallo";


	static $inject = ["$timeout"];

	constructor(timeout: ng.ITimeoutService) {
		console.log("init of S elector Controller", timeout);

		this.enigmaConfig = {
			Promise: blubird,
			schema: qixSchema,
			mixins: [customMixin.exposeAppApi],
			url: "ws://localhost:9076/app/engineData"
		};
		this.session = enigma.create(this.enigmaConfig);
		this.session.on("traffic:sent", data => console.log("sent:", data));
		this.session.on("traffic:received", () => {
			timeout();
		});

		this.session.open()
			// create session App
			.then((global: EngineAPI.IGlobal) => {

				return global.createSessionApp();
			// create connection
			}).then((app: EngineAPI.IApp) => {
				this.app = app;

				let connectionParams: any;
				connectionParams = {
					qName: "data",
					qMeta: {},
					qConnectionString: "https://raw.githubusercontent.com/thomashaenig/demos-angular/master/src/data/MetObjects.csv",
					qType: "internet"
				};

				return app.createConnection(connectionParams);
			// create load script
			}).then((connectoinId:string) => {
				console.log("connectoinId", connectoinId);

				return this.app.setScript(
					"SET ThousandSep='.';" +
					"SET DecimalSep=',';" +
					"SET MoneyThousandSep='.';" +
					"SET MoneyDecimalSep=',';" +
					"SET MoneyFormat='#.##0,00 €;-#.##0,00 €';" +
					"SET TimeFormat='hh:mm:ss';" +
					"SET DateFormat='DD.MM.YYYY';" +
					"SET TimestampFormat='DD.MM.YYYY hh:mm:ss[.fff]';" +
					"SET FirstWeekDay=0;" +
					"SET BrokenWeeks=0;" +
					"SET ReferenceDay=4;" +
					"SET FirstMonthOfYear=1;" +
					"SET CollationLocale='de-DE';" +
					"SET CreateSearchIndexOnReload=1;" +
					"SET MonthNames='Jan.;Feb.;März;Apr.;Mai;Juni;Juli;Aug.;Sep.;Okt.;Nov.;Dez.';" +
					"SET LongMonthNames='Januar;Februar;März;April;Mai;Juni;Juli;August;September;Oktober;November;Dezember';" +
					"SET DayNames='Mo.;Di.;Mi.;Do.;Fr.;Sa.;So.';" +
					"SET LongDayNames='Montag;Dienstag;Mittwoch;Donnerstag;Freitag;Samstag;Sonntag';" +
					"Data:" +
					"LOAD " +
						"[Is Highlight]," +
						"[Is Public Domain]," +
						"[Object ID]," +
						"[Department]," +
						"[Object Name]," +
						"[Title]," +
						"[Culture]," +
						"[Object Begin Date]," +
						"[Object End Date]," +
						"[Medium]," +
						"[Classification]," +
						"[Repository]" +
					"FROM [lib://data/MetObjects.csv]" +
					"(txt, utf8, embedded labels, delimiter is ';', msq);");
			// reload app
			}).then(() => {

				return this.app.doReload();
			// create hyper cube
			}).then(() => {
				return this.app.createSessionObject(this.configObject);
			}).then((object: EngineAPI.IGenericObject) => {
				this.engineRoot = object;
				return object.getLayout();
			}).then((res) => {
				console.log(res);
			});

			// .then(() => {
			// 	console.log("app", this.app);

			// 	return this.app.evaluate("sum(Title)");
			// }).then((res) => {
			// console.log(res);

			// });
	}

	public setGlobalScrollFalse() {
		$("body").css("overflow", "hidden");
	}

	public setGlobalScrollTrue() {
		$("body").css("overflow", "auto");
	}
}

app.directive("q2gSelectionExtension", q2g_ext_selectorDirective.SelectionsDirectiveFactory("Selectionextension"));
app.controller("RootCtrl", RootCtrl);