import { Component, Input } from '@angular/core';
import { Benchmark } from 'src/app/models/benchmark';

@Component({
	selector: 'app-single-chart',
	styleUrls: ['./single-chart.component.scss'],
	templateUrl: './single-chart.component.html',
})
export class SingleChartComponent {
	public data: object | null = null;
	public classShape: string | null = null;

	@Input()
	public set benchmark(benchmark: Benchmark | null) {
		if (benchmark) {
			this.data = [
				{ name: 'InstanceOf Success', value: Math.round(benchmark.iof_success)},
				{ name: 'Property Check Success', value: Math.round(benchmark.prop_check_success)},
				{ name: 'InstanceOf Fail', value: Math.round(benchmark.iof_fail)},
				{ name: 'Property Check Fail', value: Math.round(benchmark.prop_check_fail)},
			];
			this.classShape = benchmark.class_shape;
		}
	}
}
