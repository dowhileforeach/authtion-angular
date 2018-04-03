import {FormGroup} from '@angular/forms';

export class UtilsService {

  public static isEmpty(value: string): boolean {
    if (value) {
      return value.trim().length === 0;
    }
    return true;
  }

  public static isWrongControl(form: FormGroup, controlName: string, errorName: string) {
    const control = form.get(controlName);
    if ((control.dirty || control.touched)
      && control.errors !== null
      && control.errors.hasOwnProperty(errorName)) {
      return control.errors[errorName];
    }
    return false;
  }
}
