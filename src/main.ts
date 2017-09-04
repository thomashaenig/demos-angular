import { person } from "./person";

console.log(person);

class Test {

	private welcomeText: string = "Hello World es klappt mit typescript 2.5.2 zum zweiten";

	print () {
		console.log("testoutput", this.welcomeText,person);
	}
}


const var1: Test = new Test();
var1.print();