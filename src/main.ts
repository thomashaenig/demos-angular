import { person } from "./person";
import * as angular from "angular";
// import * as Halyard from "halyard.js";
import * as blubird from "bluebird";
import * as enigma from "enigma.js";
import * as WebSocket from "ws";



// let enigmaMixin = require("./node_modules/halyard.js/dist/halyard-enigma-mixin.js");
let qixSchema = require("./node_modules/enigma.js/schemas/12.20.0.json");

let app = angular.module("app",[]);

class RootCtrl {

	// private halyard: Halyard = new Halyard();
	private enigmaConfig: enigmaJS.IConfig;
	private session: enigmaJS.ISession;
	private app: EngineAPI.IApp;

	constructor() {
		console.log("init of S elector Controller");

		this.enigmaConfig = {
			Promise: blubird,
			schema: qixSchema,
			// mixins: enigmaMixin,
			url: "ws://localhost:9076/app/engineData"
		};
		this.session = enigma.create(this.enigmaConfig);
		this.session.on("traffic:sent", data => console.log("sent:", data));
		this.session.on("traffic:received", data => console.log("received:", data));

		this.session.open()
			.then((global: EngineAPI.IGlobal) => {

				return global.createSessionApp();
			}).then((app: EngineAPI.IApp) => {
				this.app = app;
				let connectionParams: any;
				connectionParams = {
					qName: "data",
					qMeta: {},
					qConnectionString: "C:\\Users\\thaenig\\Documents\\demos-angular\\src\\data",
					qType: "folder"
				};

				return app.createConnection(connectionParams);
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
			}).then(() => {

				return this.app.doReload();
			}).then(() => {
				console.log("app", this.app);

				return this.app.evaluate("sum(Title)");
			}).then((res) => {
			console.log(res);
			});
	}
}

app.controller("RootCtrl", RootCtrl);