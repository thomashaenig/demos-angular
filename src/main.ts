import * as person from "./person"

console.log(person);

class test {
	
	private text: string = "Hello World"
	
	print () {
		console.log(this.text);
	}	
}


const var1: test = new test();
var1.print();