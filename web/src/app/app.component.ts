import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

@Component({
 	selector: 'app-root',
 	templateUrl: './app.component.html',
 	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(private webSocketService: WebsocketService) {
		this.webSocketService.connect('ws://127.0.0.1:8081').subscribe(log => console.log(log));
	}

	public onBenchmarkRequest(): void {
		this.webSocketService.requestBenchmark();
	}
}
