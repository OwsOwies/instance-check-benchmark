import { Component, Input, Inject} from '@angular/core';
import { Benchmark } from '../../models/benchmark';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-result-table',
	templateUrl: './table.component.html',
})
export class ResultTableComponent {
	displayedColumns: string[] = ['index', 'iof_success', 'prop_check_success', 'iof_fail', 'prop_check_fail', 'shape'];

	@Input()
	public benchmarks: Benchmark[];

	constructor(private dialog: MatDialog) {}

	public showShapeDialog(classShape: string): void {
		this.dialog.open(ClassShapeDialogComponent, { data: { classShape }});
	}
}

@Component({
	selector: 'app-class-shape-dialog',
	template: `<span>{{data.classShape}}</span>`,
})
export class ClassShapeDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: { classShape: string }) {}
}
