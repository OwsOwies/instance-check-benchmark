const http = require('http');
const benchmark = require('benchmark');
const WebSocketServer = require('websocket').server;
const sqlite3 = require('sqlite3').verbose();

/** BENCHMARK */

class SomeClass {
	constructor(someProp) {
		this.someProp = 1;
	}
}

class SomeOtherClass {}

function runBenchmark(wsConnection) {
	const suite = benchmark.Suite('instance-check-suite', {
		onStart: this.onSuiteStart,
	})
	.add('instanceOf success', this.instanceOfSuccessTest)
	.add('property check success', this.propertyCheckSuccess)
	.add('instanceOf fail', this.instanceOfFailTest)
	.add('property check fail', this.propertyFailTest)
	.on('complete', function() {
		const result = createBenchmarkResultObj(this)
		insertResult(result);
		wsConnection.send(JSON.stringify([result]))
	})
	.run({ async: true});
}

function createBenchmarkResultObj(result) {
	return {
		iof_success: result[0].hz,
		prop_check_success: result[1].hz,
		iof_fail: result[2].hz,
		prop_check_fail: result[3].hz
	} 
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

/** DATABASE */

function insertResult(result) {
	db.run(
		'INSERT INTO Benchmark(iof_success, prop_check_success, iof_fail, prop_check_fail) VALUES (?, ?, ?, ?)',
		[result.iof_success, result.prop_check_success, result.iof_fail, result.prop_check_fail],
		function(err) {
			if (err) {
				console.log(err.message);
			}
		}
	);
}

function getBenchmarkResults(wsConnection) {
	db.all(`SELECT * FROM Benchmark`, [], (err, rows) => {
		if (err) {
			console.error(err.message);
		}
		console.log(rows);
		wsConnection.send(JSON.stringify(rows));
	});
}

/** SETUP SERVER */

const server = http.createServer(function (request, response) {}).listen(8081);

const wsServer = new WebSocketServer({
	httpServer: server
});

wsServer.on('request', function(request) {
	console.log('new connection');
	var connection = request.accept(null, request.origin);
	getBenchmarkResults(connection);

	connection.on('message', function(userMessage) {
		console.log(userMessage);
		if (userMessage.utf8Data === 'benchmark')  {
			runBenchmark(connection);
		}
	});
})

const db = new sqlite3.Database('./db/measurements.db')

console.log('Server running at http://127.0.0.1:8081/');
