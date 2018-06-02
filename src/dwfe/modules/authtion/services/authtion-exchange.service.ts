import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {interval, Observable} from 'rxjs';
import {map, switchMapTo, take} from 'rxjs/operators';

import {ExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {AbstractExchangerDwfe, ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';
import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

const API_VERSION = '/v1';

export const endpoints = {
  signIn: `${API_VERSION}/sign-in`,
  tokenRefresh: `${API_VERSION}/sign-in`,
  googleCaptchaValidate: `${API_VERSION}/google-captcha-validate`,
  signOut: `${API_VERSION}/sign-out`,
  checkEmail: `${API_VERSION}/check-email`,
  createAccount: `${API_VERSION}/create-account`,
  updateAccount: `${API_VERSION}/update-account`,
  getAccount: `${API_VERSION}/get-account`,
  reqResetPass: `${API_VERSION}/req-reset-pass`,
  confirmResetPass: `${API_VERSION}/confirm-reset-pass`,
  resetPass: `${API_VERSION}/reset-pass`,
};

@Injectable()
export class AuthtionExchangeService {

  constructor(protected _http: HttpClient) {
  }

  get http(): HttpClient {
    return this._http;
  }

  public post_checkEmail(email: string): Observable<Object> {
    return this.http.post(
      endpoints.checkEmail,
      `{ "email": "${email}" }`,
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }

  //
  // BACKEND VALIDATORS
  //
  public backendValidatorEmail(email: string, reverseHandleResp: boolean) {

    // Don't send request to the backend after each press on the keyboard.
    // Only the last result$ for the interval.
    // Based on: https://github.com/angular/angular/issues/6895#issuecomment-329464982
    const debounceTime = 500; // ms

    if (reverseHandleResp) {      // e.g. for 'Login'

      return interval(debounceTime)
        .pipe(
          switchMapTo(this.post_checkEmail(email)),
          map(
            response => {
              if (response['success']) {
                return {'backendHttp': 'Not found in database'};
              }
              return null;
            },
            error => {
              return {'backendHttp': UtilsDwfe.getReadableExchangeError(error)};
            }),
          take(1)
        );

    } else {                      // e.g. for 'Create account'

      return interval(debounceTime)
        .pipe(
          switchMapTo(this.post_checkEmail(email)),
          map(
            response => {
              if (!response['success']) {
                return {'backendHttp': UtilsDwfe.getReadableErrorFromDwfeServer(response)};
              }
              return null;
            },
            error => {
              return {'backendHttp': UtilsDwfe.getReadableExchangeError(error)};
            }),
          take(1)
        );
    }
  }

  //
  // GOOGLE CAPTCHA
  //
  public checkGoogleCaptcha(googleResponse: string, initiator: ExchangeableDwfe): void {

    if (googleResponse === null) {
      initiator.setCaptchaValid(false);
      return;
    }

    GoogleCaptchaValidateExchanger.of(this.http)
      .run(initiator,
        `{ "googleResponse": "${googleResponse}" }`,
        (data: ResultWithDescription) => {
          if (data.result) { // actions on success captcha check
            initiator.setCaptchaValid(true);
          } else {
            initiator.setErrorMessage(data.description);
          }
        }
      );
  }
}

export class GoogleCaptchaValidateExchanger extends AbstractExchangerDwfe {
  static of(http: HttpClient): GoogleCaptchaValidateExchanger {
    return new GoogleCaptchaValidateExchanger(http);
  }

  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.googleCaptchaValidate,
      body,
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}

export class CreateAccountExchanger extends AbstractExchangerDwfe {
  static of(http: HttpClient): CreateAccountExchanger {
    return new CreateAccountExchanger(http);
  }

  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.createAccount,
      body,
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}

export class GetAccountExchanger extends AbstractExchangerDwfe {
  static of(http: HttpClient): GetAccountExchanger {
    return new GetAccountExchanger(http);
  }

  getHttpReq$(params?: any): Observable<Object> {
    return this.http.get(
      endpoints.getAccount,
      AbstractExchangerDwfe.optionsForAuthorizedReq(params.accessToken)
    );
  }
}

export class ReqResetPassExchanger extends AbstractExchangerDwfe {
  static of(http: HttpClient): ReqResetPassExchanger {
    return new ReqResetPassExchanger(http);
  }

  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.reqResetPass,
      body,
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}

export class ConfirmResetPassExchanger extends AbstractExchangerDwfe {
  static of(http: HttpClient): ConfirmResetPassExchanger {
    return new ConfirmResetPassExchanger(http);
  }

  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.confirmResetPass,
      body,
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}

export class ResetPassExchanger extends AbstractExchangerDwfe {
  static of(http: HttpClient): ResetPassExchanger {
    return new ResetPassExchanger(http);
  }

  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.resetPass,
      body,
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}



