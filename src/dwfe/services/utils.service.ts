import {AbstractControl} from '@angular/forms';

export class UtilsDwfeService {

  public static isEmpty(value: string): boolean {
    if (value) {
      return value.trim().length === 0;
    }
    return true;
  }

  public static formControlHasError(control: AbstractControl, errorName: string, isDirtyTouchedCheckMode = true) {

    if (isDirtyTouchedCheckMode && !(control.dirty || control.touched)) {
      return false;
    }

    return control.errors !== null
      && control.errors.hasOwnProperty(errorName);
  }

  public static getErrorOnFormControl(control: AbstractControl, errorName: string) {
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

  public static objToStr(obj, separator = ','): string {
    let result = '';
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      result += `${keys[i]} ${obj[keys[i]]}${i === (keys.length - 1) ? '' : separator}`;
    }
    return result;
  }

  public static getReadableHttpError(obj): string {
    let result = 'Unknown';

    if (obj.hasOwnProperty('error')) {

      const error = obj['error'];

      if (error.hasOwnProperty('error')) {
        result = `${error['error']}`;
      }
      if (error.hasOwnProperty('error_description')) {
        result += `, ${error['error_description']}`
        ;
      }
    }
    return result;
  }

  public static getHttpError(obj): string {
    let result = '';

    if (obj.hasOwnProperty('error')) {

      const error = obj['error'];

      if (error.hasOwnProperty('error')) {
        result = error['error'];
      }
    }
    return result;
  }

  public static isInvalidGrantHttpError(obj): boolean {
    return UtilsDwfeService.getHttpError(obj) === 'invalid_grant';
  }
}
