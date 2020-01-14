import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { WebsocketService } from './services/websocket.service';
import { ResultTableComponent, ClassShapeDialogComponent } from './components/table/table.component';
import { ChartComponent } from './components/chart/chart.component';
import { UserInputComponent } from './components/user-input/user-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SingleChartComponent } from './components/single-chart/single-chart.component';

@NgModule({
	entryComponents: [ClassShapeDialogComponent],
	declarations: [
		AppComponent,
		ChartComponent,
		ClassShapeDialogComponent,
		ResultTableComponent,
		SingleChartComponent,
		UserInputComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatInputModule,
		MatButtonModule,
		MatDialogModule,
		MatTableModule,
		NgxChartsModule,
		ReactiveFormsModule,
		FormsModule,
	],
	providers: [WebsocketService],
	bootstrap: [AppComponent]
})
export class AppModule { }
