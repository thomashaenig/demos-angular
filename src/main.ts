import { person } from "./person";
import * as angular from "angular";
import * as template from "text!./test.html";

let app = angular.module("app",[]);

class DataApp {

	constructor() {
		console.log("init of DataApp Service", person);
	}

}

class SelectorCtrl {

	constructor() {
		console.log("init of Selector Controller", template);
	}
}

app.factory("HalyardData", DataApp);

app.controller("SelectorCtrl", SelectorCtrl);