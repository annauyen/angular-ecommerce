import { FormControl, ValidationErrors } from '@angular/forms';

export class MyValidators {
  static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
    return (control.value || '').trim().length ? null : { whitespace: true };
  }
}
