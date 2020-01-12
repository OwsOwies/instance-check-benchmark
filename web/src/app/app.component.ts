import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

@Component({
 	selector: 'app-root',
 	templateUrl: './app.component.html',
 	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(private webSocketService: WebsocketService) {
		this.webSocketService.connect('ws://127.0.0.1:8081').subscribe(this.decodeMessage);
	}

	public onBenchmarkRequest(): void {
		this.webSocketService.requestBenchmark();
	}

	public decodeMessage(message: any): void {
		console.log(JSON.parse(message.data));
	}
}
