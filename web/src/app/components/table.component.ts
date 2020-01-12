import { Component, Input} from '@angular/core';
import { Benchmark } from '../models/benchmark';

@Component({
	selector: 'app-result-table',
	templateUrl: './table.component.html',
})
export class ResultTableComponent {
	displayedColumns: string[] = ['index', 'iof_success', 'prop_check_success', 'iof_fail', 'prop_check_fail'];

	@Input()
	public benchmarks: Benchmark[];
}
