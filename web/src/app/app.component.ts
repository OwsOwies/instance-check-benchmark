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
	currentlySelected: Benchmark | null;
	isInProgress = false;

	constructor(private webSocketService: WebsocketService) {
		this.webSocketService.connect('ws://127.0.0.1:8081').subscribe(this.decodeMessage);
	}

	public onBenchmarkRequest($event: string): void {
		console.log(JSON.parse($event));
		this.isInProgress = true;
		this.webSocketService.requestBenchmark($event);
	}

	decodeMessage = (message: any): void => {
		const benchmarks = JSON.parse(message.data) as Benchmark[];
		this.results = [...this.results, ...benchmarks];
		this.isInProgress = false;
		if (this.results.length) {
			this.currentlySelected = this.results[this.results.length - 1];
		}
	}

	onChangeSelected(benchmark: Benchmark): void {
		this.currentlySelected = benchmark;
	}
}
