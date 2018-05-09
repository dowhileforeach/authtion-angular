import {AbstractControl} from '@angular/forms';

const errorCodesMap = {
  'attention-robot-detected': 'Attention! Robot detected',
  'confirm-key-for-another-email': 'Confirm key for another email',
  'confirm-key-not-exist': 'Confirm key does not exist',
  'email-not-exist': 'Email does not exist',
  'email-present-in-database': 'Email is present in database',
  'empty-confirm-key': 'Confirm key is empty',
  'empty-email': 'Email is empty',
  'empty-google-response': 'Google response is empty',
  'empty-newpass': 'New password is empty',
  'empty-oldpass': 'Old password is empty',
  'empty-password': 'Password is empty',
  'exceeded-max50-email-length': 'Email length must be <= 50',
  'exceeded-min6-or-max55-newpass-length': 'New password length >=6 and <=55',
  'exceeded-min6-or-max55-password-length': 'Password length >=6 and <=55',
  'failure-when-connecting-to-google': 'Failure when connecting to google',
  'id-not-exist': 'Id does not exist',
  'invalid-email': 'Please enter a valid email',
  'missing-confirm-key': 'Confirm key required',
  'missing-email': 'Email required',
  'missing-google-response': 'Google response required',
  'missing-newpass': 'New password required',
  'missing-oldpass': 'Old password required',
  'missing-password': 'Password required',
  'wrong-oldpass': 'Wrong old password'
};

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
  public static randomStr(requiredStringLength,
                          prefix = '',
                          postfix = ''): string {
    let result = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < requiredStringLength; i++) {
      result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return prefix + result + postfix;
  }

  public static getReadableErrorFromDwfeServer(data): string {
    let result = '';
    if (data.hasOwnProperty('error-codes')) {
      const errorCodes = data['error-codes'];
      for (let i = 0; i < errorCodes.length; i++) {
        const code = errorCodes[i];
        if (errorCodesMap.hasOwnProperty(code)) {
          result += errorCodesMap[code];
        } else {
          result += code;
        }
        if (i !== (errorCodes.length - 1)) {
          result += '<br>';
        }
      }
    }
    return result;
  }

  public static getReadableHttpError(obj): string {
    let result = 'Unknown';

    if (obj.hasOwnProperty('error')) {

      const error = obj['error'];

      if (error.hasOwnProperty('error')) {
        result = `${error['error']}`;
      } else if (error.hasOwnProperty('error_description')) {
        result += `, ${error['error_description']}`
        ;
      }
    }
    return result;
  }

  public static getReadableHttpError(obj): string {
    let result = '';

    if (obj.hasOwnProperty('error')) {

      const error = obj['error'];

      if (error.hasOwnProperty('error')) {
        result = error['error'];
      } else if (obj.hasOwnProperty('statusText')) {
        result = obj['statusText'];
      }
    }
    return result;
  }

  public static isInvalidGrantHttpError(obj): boolean {
    return UtilsDwfeService.getReadableHttpError(obj) === 'invalid_grant';
  }
}
