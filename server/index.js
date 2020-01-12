var http = require('http');
var benchmark = require('benchmark');

class SomeClass {
	constructor(someProp) {
		this.someProp = 1;
	}
}

class SomeOtherClass {}

function runBenchmark() {
	const suite = benchmark.Suite('instance-check-suite', {
		onStart: this.onSuiteStart,
	})
	.add('instanceOf success', this.instanceOfSuccessTest)
	.add('property check success', this.propertyCheckSuccess)
	.add('instanceOf fail', this.instanceOfFailTest)
	.add('property check fail', this.propertyFailTest)
	.on('complete', function() {
		console.log(this[0].toString());
		console.log(this[1].toString());
	})
	.run({ async: true});
}

onSuiteStart = () => {
	console.log('suite start');

	this.someClassItems = [];
	this.someOtherClassItems = [];

	for (let i = 0; i < 1000; i++) {
		this.someClassItems.push(new SomeClass(1));
		this.someOtherClassItems.push(new SomeOtherClass());
	}
}

instanceOfSuccessTest = () => {
	for (let i = 0; i < 1000; i++) {
		const t = this.someClassItems[i];
		const result = t instanceof SomeClass;
	}
}

propertyCheckSuccess = () => {
	for (let i = 0; i < 1000; i++) {
		const t = this.someClassItems[i];
		const result = t.property;
	}
}

instanceOfFailTest = () => {
	for (let i = 0; i < 1000; i++) {
		const t = this.someOtherClassItems[i];
		const result = t instanceof SomeClass;
	}
}

propertyFailTest = () => {
	for (let i = 0; i < 1000; i++) {
		const t = this.someOtherClassItems[i];
		const result = t.property;
	}
}

http.createServer(function (request, response) {
	 response.writeHead(200, {'Content-Type': 'text/plain'});

	 console.log(runBenchmark());

   response.end('Hello World\n');
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');
