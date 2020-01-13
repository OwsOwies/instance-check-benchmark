import { Component, EventEmitter, Output } from '@angular/core';
import { Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
	selector: 'app-user-input',
	styleUrls: ['./user-input.component.scss'],
	templateUrl: './user-input.component.html',
})
export class UserInputComponent {
	formControl = new FormControl('', [
		Validators.required,
		JSONValidator(),
	]);

	@Output()
	public submitForm = new EventEmitter<string>();

	public onSubmit(): void {
		this.submitForm.emit(this.formControl.value);
	}
}

export function JSONValidator(): ValidatorFn {
	return (control: AbstractControl): {[key: string]: any} | null => {
		try {
			const json = JSON.parse(control.value);
			return null;
		} catch (e) {
			return {json: { value: e }};
		}
	};
}
