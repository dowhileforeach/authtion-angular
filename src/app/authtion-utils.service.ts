import {AbstractControl} from '@angular/forms';

export class AuthtionUtilsService {

  public static isEmpty(value: string): boolean {
    if (value) {
      return value.trim().length === 0;
    }
    return true;
  }

  public static controlHasError(control: AbstractControl, errorName: string, isDirtyTouchedCheckMode = true) {

    if (isDirtyTouchedCheckMode && !(control.dirty || control.touched)) {
      return false;
    }

    return control.errors !== null
      && control.errors.hasOwnProperty(errorName);
  }

  public static getErrorOfControl(control: AbstractControl, errorName: string) {
    return control.errors[errorName];
  }

  // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  public static randomStr(prefix = '',
                          requiredStringLength = 5,
                          postfix = ''): string {
    let result = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < requiredStringLength; i++) {
      result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return prefix + result + postfix;
  }

  public static objToStr(obj, eachStrOnNewLine = true): string {
    let result = '';
    for (const prop of Object.keys(obj)) {
      result += `${prop} ${obj[prop]}${eachStrOnNewLine ? '' : ''}`;
    }
    return result;
  }
}
