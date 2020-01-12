var http = require('http');
var benchmark = require('benchmark');
var WebSocketServer = require('websocket').server;

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

server = http.createServer(function (request, response) {}).listen(8081);

wsServer = new WebSocketServer({
	httpServer: server
});

wsServer.on('request', function(request) {
	console.log('new connection');
	var connection = request.accept(null, request.origin);

	connection.on('message', function(userMessage) {
		console.log(userMessage);
		if (userMessage.utf8Data === 'benchmark')  {
			runBenchmark();
		}
	});
})

console.log('Server running at http://127.0.0.1:8081/');
