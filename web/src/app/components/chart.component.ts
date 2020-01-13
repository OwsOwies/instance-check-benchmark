import { Component, Input } from '@angular/core';
import { Benchmark } from '../models/benchmark';

@Component({
	selector: 'app-chart',
	styleUrls: ['./chart.component.scss'],
	templateUrl: './chart.component.html',
})
export class ChartComponent {
	public data: object[] = [];

	@Input()
	set benchmarks(benchmarks: Benchmark[]) {
		const instanceOfSuccessSeries = { name: 'InstanceOf Success', series: [] };
		const propCheckSuccessSeries = { name: 'Property Check Success', series: [] };
		const instanceOfFailSeries = { name: 'InstanceOf Fail', series: [] };
		const propCheckFailSeries = { name: 'Property Check Fail', series: [] };

		for (let i = 0; i < benchmarks.length; i++) {
			instanceOfSuccessSeries.series.push({ name: i, value: Math.round(benchmarks[i].iof_success) });
			propCheckSuccessSeries.series.push({ name: i, value: Math.round(benchmarks[i].prop_check_success) });
			instanceOfFailSeries.series.push({ name: i, value: Math.round(benchmarks[i].iof_fail) });
			propCheckFailSeries.series.push({ name: i, value: Math.round(benchmarks[i].prop_check_fail) });
		}

		this.data = [instanceOfSuccessSeries, propCheckSuccessSeries, instanceOfFailSeries, propCheckFailSeries];
	}
}
