const http = require('http');
const benchmark = require('benchmark');
const WebSocketServer = require('websocket').server;
const sqlite3 = require('sqlite3').verbose();

/** BENCHMARK */

class SomeOtherClass {}

function runBenchmark(wsConnection, classShape) {
	const classCtor = this.createUserDefinedClass(classShape);
	const classKeys = Object.keys(classShape);

	const suite = benchmark.Suite('instance-check-suite', {
		onStart: () => this.onSuiteStart(classCtor, classShape),
	})
	.add('instanceOf success', () => this.instanceOfSuccessTest(classCtor))
	.add('property check success', () => this.propertyCheckSuccess(classKeys))
	.add('instanceOf fail', () => this.instanceOfFailTest(classCtor))
	.add('property check fail', () => this.propertyFailTest(classKeys))
	.on('complete', function() {
		const result = createBenchmarkResultObj(this)
		console.log('Newest result', result);
		insertResult(result);
		wsConnection.send(JSON.stringify([result]))
	})
	.run({ async: false });
}

function createBenchmarkResultObj(result) {
	return {
		iof_success: result[0].hz,
		prop_check_success: result[1].hz,
		iof_fail: result[2].hz,
		prop_check_fail: result[3].hz
	} 
}

createUserDefinedClass = (classParams) => {
	const classCtor = class SomeClass {
		constructor(classParams) {
			const keys = Object.keys(classParams);
			keys.forEach(key => this[key] = classParams[key]);
		} 
	}
	return classCtor;
}

onSuiteStart = (classCtor, classParams) => {
	console.log('suite start');
	console.log('Class shape: ', new classCtor(classParams))
	this.someClassItems = [];
	this.someOtherClassItems = [];

	for (let i = 0; i < 1000; i++) {
		this.someClassItems.push(new classCtor(classParams));
		this.someOtherClassItems.push(new SomeOtherClass());
	}
}

instanceOfSuccessTest = (classCtor) => {
	for (let i = 0; i < 1000; i++) {
		const t = this.someClassItems[i];
		const result = t instanceof classCtor;
	}
}

propertyCheckSuccess = (classKeys) => {
	for (let i = 0; i < 1000; i++) {
		const t = this.someClassItems[i];
		let combined = false;
		classKeys.forEach(key => (combined = combined && t[key]));
		const result = combined;
	}
}

instanceOfFailTest = (classCtor) => {
	for (let i = 0; i < 1000; i++) {
		const t = this.someOtherClassItems[i];
		const result = t instanceof classCtor;
	}
}

propertyFailTest = (classKeys) => {
	for (let i = 0; i < 1000; i++) {
		const t = this.someOtherClassItems[i];
		let combined = false;
		classKeys.forEach(key => (combined = combined && t[key]));
		const result = combined;
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
		console.log("Current rows length" + rows.length);
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
		const msg = JSON.parse(userMessage.utf8Data);
		if (msg.code === 'benchmark')  {
			runBenchmark(connection, msg.payload);
		}
	});
})

const db = new sqlite3.Database('./db/measurements.db')

console.log('Server running at http://127.0.0.1:8081/');
