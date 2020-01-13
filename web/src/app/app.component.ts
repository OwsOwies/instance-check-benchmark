import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { Benchmark } from './models/benchmark';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	results: Benchmark[] = [];

	constructor(private webSocketService: WebsocketService) {
		this.webSocketService.connect('ws://127.0.0.1:8081').subscribe(this.decodeMessage);
	}

	public onBenchmarkRequest($event: string): void {
		console.log(JSON.parse($event));
		this.webSocketService.requestBenchmark($event);
	}

	decodeMessage = (message: any): void => {
		const benchmarks = JSON.parse(message.data) as Benchmark[];
		this.results = [...this.results, ...benchmarks];
	}
}
