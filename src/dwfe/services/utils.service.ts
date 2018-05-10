import {AbstractControl} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

const dwfeAuthtionErrorCodesMap = {
  'attention-robot-detected': 'Attention! Robot detected',
  'confirm-key-for-another-email': 'Confirm key for another email',
  'confirm-key-not-exist': 'Confirm key does not exist',
  'google-captcha-gateway-timeout': 'Google captcha gateway timeout. Try again later',
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
  'failure-when-connecting-to-google': 'Failure when connecting to google. Try again later',
  'id-not-exist': 'Id does not exist',
  'invalid-email': 'Please enter a valid email',
  'missing-confirm-key': 'Confirm key required',
  'missing-email': 'Email required',
  'missing-google-response': 'Google response required',
  'missing-newpass': 'New password required',
  'missing-oldpass': 'Old password required',
  'missing-password': 'Password required',
  'wrong-oldpass': 'Wrong old password',
};

const dwfeServerErrorsMap = {
  'access_denied': 'Access denied',
  'insufficient_scope': 'Insufficient scope',
  'invalid_client': 'Invalid client',
  'invalid_grant': 'Invalid grant',
  'invalid_request': 'Invalid request',
  'invalid_scope': 'Invalid scope',
  'invalid_token': 'Invalid token',
  'method_not_allowed': 'Method not allowed',
  'redirect_uri_mismatch': 'Redirect URI mismatch',
  'server_error': 'Server error',
  'unauthorized': 'Unauthorized',
  'unauthorized_client': 'Unauthorized client',
  'unauthorized_user': 'Unauthorized user',
  'unsupported_grant_type': 'Unsupported grant type',
  'unsupported_response_type': 'Unsupported response type',
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
        if (dwfeAuthtionErrorCodesMap.hasOwnProperty(code)) {
          result += dwfeAuthtionErrorCodesMap[code];
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

  public static getReadableExchangeError(obj: HttpErrorResponse): string {
    let result = ''; // Unknown

    const status = obj.status || -1;
    const statusText = obj.statusText || '';

    if (status >= 0) {
      result += `${status}: `;
    }

    // Error Option 1
    // ==============
    // error: "..."
    //
    // Error Option 2
    // ==============
    // error: {
    //   error: "error_code",
    //   error_description: "..."
    // }

    const error = obj.error || {};
    const errorCode = error['error'] || null;

    if (errorCode) {
      result += dwfeServerErrorsMap[errorCode] || errorCode;
    } else if (statusText !== '') {
      result += statusText;
    } else {
      result = error;
    }
    return result;
  }

  public static isInvalidGrantError(obj: HttpErrorResponse): boolean {
    const error = obj.error || {};
    const errorCode = error['error'] || null;
    if (errorCode) {
      return 'invalid_grant' === errorCode;
    } else {
      return false;
    }
  }
}
