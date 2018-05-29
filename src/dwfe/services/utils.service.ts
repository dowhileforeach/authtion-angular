import {ElementRef} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

import {Observable, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

const dwfeAuthtionErrorCodesMap = {
  'confirm-key-not-exist': 'Confirm key does not exist',
  'delay-between-duplicate-requests': 'You\'ve already sent a request. Please check your email box or try again later',
  'email-is-already-confirmed': 'Email is already confirmed',
  'email-not-exist': 'Not found in database',
  'email-present-in-database': 'Email is present in database',
  'empty-confirm-key': 'Confirm key is empty',
  'empty-email': 'Email is empty',
  'empty-google-response': 'Google response is empty. Try again',
  'empty-newpass': 'New password is empty',
  'empty-oldpass': 'Old password is empty',
  'empty-password': 'Password is empty',
  'error-google-captcha-gateway': 'Captcha-check gateway error. Try again later',
  'exceeded-max50-email-length': 'Email length must be <= 50',
  'exceeded-min6-or-max55-newpass-length': 'New password length >=6 and <=55',
  'exceeded-min6-or-max55-password-length': 'Password length >=6 and <=55',
  'google-captcha-detected-robot': 'Captcha-check detected a robot',
  'id-not-exist': 'Id does not exist',
  'invalid-country': 'Country is invalid',
  'invalid-email': 'Please enter a valid email',
  'invalid-gender': 'Gender is invalid',
  'missing-confirm-key': 'Confirm key required',
  'missing-email': 'Email required',
  'missing-google-response': 'Google response required',
  'missing-newpass': 'New password required',
  'missing-oldpass': 'Old password required',
  'missing-password': 'Password required',
  'timeout-google-captcha-gateway': 'Captcha-check gateway timeout. Try again later',
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

  public static focusOnDwfeInput(elementRef: ElementRef) {
    elementRef.nativeElement.querySelector('.dwfe-form-group input').focus();
  }

  public static resetBackendError(controlFieldName, fieldsArr, notifier: Observable<any>): Subscription {
    return this[controlFieldName].valueChanges
      .pipe(takeUntil(notifier))
      .subscribe(() => {
        fieldsArr.forEach(errorFieldName => {
          if (this[errorFieldName] !== '') {
            this[errorFieldName] = '';
          }
        });
      });
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

    let result = '';
    const error = obj.error;
    const status = obj.status;
    const statusText = obj.statusText;

    if (status) {
      result += `${status}: `;
    }

    // Error Option 1.
    // Real Http error
    // ===============
    // error: "..."
    //
    // Error Option 2.
    // Most likely an internal DWFE server error
    // =========================================
    // error: {
    //   error: "error_code",
    //   error_description: "..."
    // }

    if (error && error.hasOwnProperty('error')) {
      const errorCode = error['error'];
      const errorDescriptionPropName = 'error_description';
      if (error.hasOwnProperty(errorDescriptionPropName)) {
        result += error[errorDescriptionPropName]; // https://github.com/dowhileforeach/authtion#oauth2-server-error
      } else if (dwfeServerErrorsMap.hasOwnProperty(errorCode)) {
        result += dwfeServerErrorsMap[errorCode];
      } else {
        result += errorCode;
      }
    } else if (statusText) {
      result += statusText;
    } else if (error) {
      result += error;
    } else {
      result += 'Unknown error';
    }
    return result;
  }

  public static isInvalidGrantError(obj: HttpErrorResponse): boolean {
    const error = obj.error;
    if (error && error.hasOwnProperty('error')) {
      return error['error'] === 'invalid_grant';
    } else {
      return false;
    }
  }
}
