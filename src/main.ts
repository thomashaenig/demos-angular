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

		// adds data to halyard
		// this.halyard.addTable(this.createTable());

		this.session.open().then((global: EngineAPI.IGlobal) => {

			// return global.createSessionApp();


			global.openDoc("daVinci").then((test:any) => {
				console.log(test);

				return test.evaluate("sum(Title)");
			}).then((res) => {
				console.log(res);
			});

			// (global as any).createAppUsingHalyard("davinci", this.halyard);
				// .then((result) => {
				// 	console.log("RESULT", result);
				// });
		});
		// .then((res) => {
		// 	this.app = res;
		// 	return res.setScript(
		// 		"SET ThousandSep='.';" +
		// 		"SET DecimalSep=',';" +
		// 		"SET MoneyThousandSep='.';" +
		// 		"SET MoneyDecimalSep=',';" +
		// 		"SET MoneyFormat='#.##0,00 €;-#.##0,00 €';" +
		// 		"SET TimeFormat='hh:mm:ss';" +
		// 		"SET DateFormat='DD.MM.YYYY';" +
		// 		"SET TimestampFormat='DD.MM.YYYY hh:mm:ss[.fff]';" +
		// 		"SET FirstWeekDay=0;" +
		// 		"SET BrokenWeeks=0;" +
		// 		"SET ReferenceDay=4;" +
		// 		"SET FirstMonthOfYear=1;" +
		// 		"SET CollationLocale='de-DE';" +
		// 		"SET CreateSearchIndexOnReload=1;" +
		// 		"SET MonthNames='Jan.;Feb.;März;Apr.;Mai;Juni;Juli;Aug.;Sep.;Okt.;Nov.;Dez.';" +
		// 		"SET LongMonthNames='Januar;Februar;März;April;Mai;Juni;Juli;August;September;Oktober;November;Dezember';" +
		// 		"SET DayNames='Mo.;Di.;Mi.;Do.;Fr.;Sa.;So.';" +
		// 		"SET LongDayNames='Montag;Dienstag;Mittwoch;Donnerstag;Freitag;Samstag;Sonntag';" +
		// 		"Data:" +
		// 		"LOAD" +
		// 			"'Object Number'," +
		// 			"'Is Highlight'," +
		// 			"'Is Public Domain'," +
		// 			"'Object ID'," +
		// 			"Department," +
		// 			"'Object Name'," +
		// 			"Title," +
		// 			"Culture," +
		// 			"Period," +
		// 			"Dynasty," +
		// 			"Reign," +
		// 			"Portfolio," +
		// 		"'Artist Role'," +
		// 		"'Artist Prefix'," +
		// 		"'Artist Display Name'," +
		// 		"'Artist Display Bio'," +
		// 		"'Artist Suffix'," +
		// 		"'Artist Alpha Sort'," +
		// 		"'Artist Nationality'," +
		// 		"'Artist Begin Date'," +
		// 		"'Artist End Date'," +
		// 		"'Object Date'," +
		// 		"'Object Begin Date'," +
		// 		"'Object End Date'," +
		// 		"Medium," +
		// 		"Dimensions," +
		// 		"'Credit Line'," +
		// 		"'Geography Type'," +
		// 		"City," +
		// 		"State," +
		// 		"County," +
		// 		"Country," +
		// 		"Region," +
		// 		"Subregion," +
		// 		"Locale," +
		// 		"Locus," +
		// 		"Excavation," +
		// 		"River," +
		// 		"Classification," +
		// 		"'Rights and Reproduction'," +
		// 		"'Link Resource'," +
		// 		"'Metadata Date'," +
		// 		"Repository" +
		// 		"FROM [lib://data/MetObjects.csv]" +
		// 		"(txt, utf8, embedded labels, delimiter is ',', msq);");
		// }).then(() => {
		// 	return this.app.doReload();
		// }).then(() => {
		// 	return this.app.evaluate("sum(Title)");
		// }).then((res) => {
		// 	console.log(res);
		// });

	}

	private createTable(): Halyard.Table {

		let filePathMovie = "C:\\Users\\thaenig\\Documents\\demos-angular\\src\\data\\MetObjects.csv";

		const tableMovie: Halyard.Table = new Halyard.Table(filePathMovie, {
			name: "Objects",
			fields: [
				{src:"ObjectNumber", name: "Object Number"},
				{src:"IsHighlight", name: "Is Highlight"},
				{src:"IsPublicDomain", name: "Is Public Domain"},
				{src:"ObjectID", name: "Object ID"},
				{src:"Department", name: "Department"},
				{src:"ObjectName", name: "Object Name"},
				{src:"Title", name: "Title"},
				{src:"Culture", name: "Culture"},
				{src:"Period", name: "Period"},
				{src:"Dynasty", name: "Dynasty"},
				{src:"Reign", name: "Reign"},
				{src:"Portfolio", name: "Portfolio"},
				{src:",ArtistRole", name: ",Artist Role"},
				{src:"ArtistPrefix", name: "Artist Prefix"},
				{src:"ArtistDisplayName", name: "Artist Display Name"},
				{src:"ArtistDisplayBio", name: "Artist Display Bio"},
				{src:"ArtistSuffix", name: "Artist Suffix"},
				{src:"ArtistAlphaSort", name: "Artist Alpha Sort"},
				{src:"ArtistNationality", name: "Artist Nationality"},
				{src:"ArtistBeginDate", name: "Artist Begin Date"},
				{src:"ArtistEndDate", name: "Artist End Date"},
				{src:"ObjectDate", name: "Object Date"},
				{src:"ObjectBeginDate", name: "Object Begin Date"},
				{src:"ObjectEndDate", name: "Object End Date"},
				{src:"Medium", name: "Medium"},
				{src:"Dimensions", name: "Dimensions"},
				{src:"CreditLine", name: "Credit Line"},
				{src:"GeographyType", name: "Geography Type"},
				{src:"City", name: "City"},
				{src:"State", name: "State"},
				{src:"County", name: "County"},
				{src:"Region", name: "Region"},
				{src:"Subregion", name: "Subregion"},
				{src:"Locale", name: "Locale"},
				{src:"Locus", name: "Locus"},
				{src:"Excavation", name: "Excavation"},
				{src:"River", name: "River"},
				{src:"Classification", name: "Classification"},
				{src:"RightsandReproduction", name: "Rights and Reproduction"},
				{src:"LinkResource", name: "Link Resource"},
				{src:"MetadataDate", name: "Metadata Date"},
				{src:"Repository", name: "Repository"}
			],
			delimiter: ","
		});

		return tableMovie;
	}
}

app.controller("RootCtrl", RootCtrl);