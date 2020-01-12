import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';

@Injectable()
export class WebsocketService {
	private socket: Subject<unknown>;
	private ws: WebSocket;

	public connect(url: string): Subject<unknown> {
		if (!this.socket) {
			this.create(url);
		}
		return this.socket;
	}

	private create(url: string): void {
		this.socket = new Subject();
		this.ws = new WebSocket(url);
		console.log(url, this.ws);
		const observable = new Observable(
			(obs: Observer<MessageEvent>) => {
					this.ws.onmessage = obs.next.bind(obs);
					this.ws.onerror = obs.error.bind(obs);
					this.ws.onclose = obs.complete.bind(obs);
					return this.ws.close.bind(this.ws);
			}
		).subscribe(this.socket);
	}

	public requestBenchmark(): void {
		this.ws.send('benchmark');
	}
}
