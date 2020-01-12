import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';


import { AppComponent } from './app.component';
import { WebsocketService } from './services/websocket.service';
import { ResultTableComponent } from './components/table.component';

@NgModule({
	declarations: [
		AppComponent,
		ResultTableComponent,
	],
	imports: [
		BrowserModule,
		MatTableModule,
	],
	providers: [WebsocketService],
	bootstrap: [AppComponent]
})
export class AppModule { }
