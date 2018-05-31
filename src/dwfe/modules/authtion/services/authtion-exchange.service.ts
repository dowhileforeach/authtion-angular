import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {interval, Observable} from 'rxjs';
import {map, switchMapTo, take} from 'rxjs/operators';

import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';
import {AbstractExchangableDwfe} from '@dwfe/classes/AbstractExchangableDwfe';
import {AbstractExchangerDwfe, ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';

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
  reqRestorePass: `${API_VERSION}/req-restore-pass`,
};

@Injectable()
export class AuthtionExchangeService {

  constructor(private _http: HttpClient) {
  }

  get http(): HttpClient {
    return this._http;
  }

  public post_checkEmail(email: string): Observable<Object> {
    return this._http.post(
      endpoints.checkEmail,
      AbstractExchangerDwfe.bodySimple('email', email),
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }


  //
  // BACKEND VALIDATORS
  //
  public backendValidatorEmail(email, reverseHandleResp) {
    const observable = this.post_checkEmail(email);

    // Don't send request to the backend on keyup. Only the last result$ for the interval.
    // Based on: https://github.com/angular/angular/issues/6895#issuecomment-329464982
    const debounceTime = 500; // ms

    if (reverseHandleResp) { // for 'Login'

      return interval(debounceTime).pipe(
        switchMapTo(observable),
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

    } else { // for 'Create account'

      return interval(debounceTime).pipe(
        switchMapTo(observable),
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

    // return this.reverseHandleResp ?
    //   new Promise(resolve => { // for 'Login'
    //     this.connect.pipe(retry(3)).subscribe(
    //       data => data['success'] ? resolve({'backendHttp': 'Not found in our database'}) : resolve(null),
    //       error => resolve({'http': error.message})
    //     );
    //   })
    //   : new Promise(resolve => { // for 'Create account'
    //     this.connect.pipe(retry(3)).subscribe(
    //       data => {
    //         data['success'] ? resolve(null) : resolve({'backendHttp': this.getReadableErrorFromDwfeServer(data)});
    //         this.emailControl.markAsTouched();
    //       },
    //       error => resolve({'http': error.message})
    //     );
    //   });
  }

  //
  // GOOGLE CAPTCHA
  //
  public checkGoogleCaptcha(googleResponse: string, initiator: AbstractExchangableDwfe): void {

    if (googleResponse === null) {
      initiator.setCaptchaValid(false);
      return;
    }

    GoogleCaptchaValidateExchange.of(this.http)
      .run(
        initiator,
        {
          googleResponse: googleResponse
        },
        (data: ResultWithDescription) => {
          if (data.result) { // actions on success captcha check
            initiator.setCaptchaValid(true);
          } else {
            initiator.setErrorMessage(data.description);
          }
          initiator.setLocked(false);
        }
      );
  }
}

export class GoogleCaptchaValidateExchange extends AbstractExchangerDwfe {
  static of(http: HttpClient): GoogleCaptchaValidateExchange {
    return new GoogleCaptchaValidateExchange(http);
  }

  getHttpReq$(params?: any): Observable<Object> {
    return this.http.post(
      endpoints.googleCaptchaValidate,
      AbstractExchangerDwfe.bodySimple('googleResponse', params.googleResponse),
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}

export class CreateAccountExchange extends AbstractExchangerDwfe {
  static of(http: HttpClient): CreateAccountExchange {
    return new CreateAccountExchange(http);
  }

  getHttpReq$(params?: any): Observable<Object> {
    return this.http.post(
      endpoints.createAccount,
      AbstractExchangerDwfe.bodySimple('email', params.email),
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}

export class GetAccountExchange extends AbstractExchangerDwfe {
  static of(http: HttpClient): GetAccountExchange {
    return new GetAccountExchange(http);
  }

  getHttpReq$(params?: any): Observable<Object> {
    return this.http.get(
      endpoints.getAccount,
      AbstractExchangerDwfe.optionsForAuthorizedReq(params.accessToken)
    );
  }
}

export class ReqRestorePassExchanger extends AbstractExchangerDwfe {
  static of(http: HttpClient): ReqRestorePassExchanger {
    return new ReqRestorePassExchanger(http);
  }

  getHttpReq$(params?: any): Observable<Object> {
    return this.http.post(
      endpoints.reqRestorePass,
      AbstractExchangerDwfe.bodySimple('email', params.email),
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}




