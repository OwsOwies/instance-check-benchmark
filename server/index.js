const http = require('http');
const benchmark = require('benchmark');
const WebSocketServer = require('websocket').server;
const sqlite3 = require('sqlite3').verbose();

/** BENCHMARK */

class SomeOtherClass {}

function runBenchmark(wsConnection, classShape) {
	const classCtor = this.createUserDefinedClass(classShape);
	const classKeys = Object.keys(classShape);

	this.onSuiteStart(classCtor, classShape)
	const suite = benchmark.Suite('instance-check-suite')
	.add('instanceOf success', () => this.instanceOfSuccessTest(classCtor))
	.add('property check success', () => this.propertyCheckSuccess(classKeys))
	.add('instanceOf fail', () => this.instanceOfFailTest(classCtor))
	.add('property check fail', () => this.propertyFailTest(classKeys))
	.on('complete', function() {
		const result = createBenchmarkResultObj(this, new classCtor(classShape))
		console.log('Newest result', result);
		insertResult(result);
		wsConnection.send(JSON.stringify([result]))
	})
	.run({ async: true });
}

function createBenchmarkResultObj(result, classShape) {
	return {
		iof_success: result[0].hz,
		prop_check_success: result[1].hz,
		iof_fail: result[2].hz,
		prop_check_fail: result[3].hz,
		class_shape: JSON.stringify(classShape),
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
	this.someClassItem = new classCtor(classParams);
	this.someOtherClassItem = new SomeOtherClass();
	this.result = null;
	this.combined = null;
}

instanceOfSuccessTest = (classCtor) => {
	this.result = this.someClassItem instanceof classCtor;
}

propertyCheckSuccess = (classKeys) => {
	this.combined = true;
	classKeys.map(key => (this.combined = this.combined && this.someClassItem[key]));
	this.result = this.combined;
}

instanceOfFailTest = (classCtor) => {
	this.result = this.someOtherClassItem instanceof classCtor;
}

propertyFailTest = (classKeys) => {
	this.combined = true;
	classKeys.map(key => (this.combined = this.combined && this.someOtherClassItem[key]));
	this.result = this.combined;
}

/** DATABASE */

function insertResult(result) {
	db.run(
		'INSERT INTO Benchmark(iof_success, prop_check_success, iof_fail, prop_check_fail, class_shape) VALUES (?, ?, ?, ?, ?)',
		[result.iof_success, result.prop_check_success, result.iof_fail, result.prop_check_fail, result.class_shape],
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
