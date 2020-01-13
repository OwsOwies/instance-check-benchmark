import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgxChartsModule } from '@swimlane/ngx-charts';


import { AppComponent } from './app.component';
import { WebsocketService } from './services/websocket.service';
import { ResultTableComponent } from './components/table.component';
import { ChartComponent } from './components/chart.component';

@NgModule({
	declarations: [
		AppComponent,
		ChartComponent,
		ResultTableComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatTableModule,
		NgxChartsModule,
	],
	providers: [WebsocketService],
	bootstrap: [AppComponent]
})
export class AppModule { }
