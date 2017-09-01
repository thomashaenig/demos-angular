import * as person from "./person";

console.log(person);

class Test {

	private welcomeText: string = "Hello World es klappt mit typescript 2.5.2";

	print () {
		console.log("testoutput", this.welcomeText);
	}
}


const var1: Test = new Test();
var1.print();