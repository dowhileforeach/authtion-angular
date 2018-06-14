import {ElementRef} from '@angular/core';
import {AbstractControl, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

import {ErrorStateMatcher} from '@angular/material';

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
  'empty-curpass': 'Current Password is empty',
  'empty-newpass': 'New Password is empty',
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
  'missing-curpass': 'Current Password required',
  'missing-password': 'Password required',
  'timeout-google-captcha-gateway': 'Captcha-check gateway timeout. Try again later',
  'wrong-curpass': 'Current Password is wrong',
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
  'unauthorized_user': 'Unauthorized userPersonal',
  'unsupported_grant_type': 'Unsupported grant type',
  'unsupported_response_type': 'Unsupported response type',
};

export const genders: { value: string, viewValue: string }[] = [
  {value: null, viewValue: 'Not selected'},
  {value: 'M', viewValue: 'Male'},
  {value: 'F', viewValue: 'Female'},
];

export const countries: { value: string, viewValue: string, alpha3: string, phoneCode: string }[] = [
  {value: null, viewValue: 'Not selected', alpha3: '', phoneCode: ''},
  {value: 'RU', viewValue: 'Russia', alpha3: 'RUS', phoneCode: '7'},
  {value: 'UA', viewValue: 'Ukraine', alpha3: 'UKR', phoneCode: '380'},
  {value: 'DE', viewValue: 'Germany', alpha3: 'DEU', phoneCode: '49'},
  {value: 'US', viewValue: 'United States', alpha3: 'USA', phoneCode: '1'},
  {value: 'GB', viewValue: 'United Kingdom', alpha3: 'GBR', phoneCode: '44'},
  {value: 'JP', viewValue: 'Japan', alpha3: 'JPN', phoneCode: '81'},
];


export class UtilsDwfe {

  static isEmpty(value: string): boolean {
    if (value) {
      return value.trim().length === 0;
    }
    return true;
  }

  static formControlHasError(control: AbstractControl, errorName: string, isDirtyTouchedCheckMode = true) {

    if (isDirtyTouchedCheckMode && !(control.dirty || control.touched)) {
      return false;
    }

    return control.errors !== null
      && control.errors.hasOwnProperty(errorName);
  }

  static getErrorOnFormControl(control: AbstractControl, errorName: string) {
    return control.errors[errorName];
  }

  static focusOnDwfeInput(elementRef: ElementRef) {
    elementRef.nativeElement.querySelector('.dwfe-form-group-material input').focus();
  }

  static resetBackendMessage(controlFieldName, fieldsArr, notifier: Observable<any>): Subscription {
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
  static randomStr(requiredStringLength,
                   prefix = '',
                   postfix = ''): string {
    let result = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < requiredStringLength; i++) {
      result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return prefix + result + postfix;
  }

  static getFormattedDate(date: Date) { // https://stackoverflow.com/questions/2013255/how-to-get-year-month-day-from-a-date-object
    const yyyyD = date.getFullYear();
    const mmD = (date.getMonth() + 1);
    const ddD = date.getDate();
    let yyyy = yyyyD + '';
    let mm = mmD + '';
    let dd = ddD + '';

    if (yyyyD < 1000) {
      yyyy = '0' + yyyy;
    }
    if (yyyyD < 100) {
      yyyy = '0' + yyyy;
    }
    if (yyyyD < 10) {
      yyyy = '0' + yyyy;
    }

    if (mmD < 10) {
      mm = '0' + mm;
    }

    if (ddD < 10) {
      dd = '0' + dd;
    }

    return yyyy + '-' + mm + '-' + dd;
  }

  static getReadableErrorFromDwfeServer(data): string {
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

  static getReadableExchangeError(obj: HttpErrorResponse): string {

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

  static isInvalidGrantError(obj: HttpErrorResponse): boolean {
    const error = obj.error;
    if (error && error.hasOwnProperty('error')) {
      return error['error'] === 'invalid_grant';
    } else {
      return false;
    }
  }

  static optionsForAnonymouseReq() {
    return {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };
  }

  static optionsForAuthorizedReq(accessToken: string) {
    return {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + accessToken
      }
    };
  }
}

export class MyErrorStateMatcherDwfe implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
