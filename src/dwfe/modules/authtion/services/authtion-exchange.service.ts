import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {interval, Observable} from 'rxjs';
import {map, switchMapTo, take} from 'rxjs/operators';

import {ExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {ResultWithDescription} from '@dwfe/classes/AbstractExchangerDwfe';
import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

import {AuthtionService} from './authtion.service';
import {
  ChangePassExchanger,
  ConfirmResetPassExchanger,
  CreateAccountExchanger,
  endpoints,
  GetAccountExchanger,
  GoogleCaptchaValidateExchanger,
  ReqResetPassExchanger,
  ResetPassExchanger,
} from '../exchange';

@Injectable()
export class AuthtionExchangeService {

  constructor(private http: HttpClient,
              private authtionService: AuthtionService) {
  }

  private post_checkEmail(email: string): Observable<Object> {
    return this.http.post(
      endpoints.checkEmail,
      `{ "email": "${email}" }`,
      UtilsDwfe.optionsForAnonymouseReq());
  }

  //
  // BACKEND VALIDATORS
  //
  backendValidatorEmail(email: string, reverseHandleResp: boolean) {

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
  checkGoogleCaptcha(googleResponse: string, initiator: ExchangeableDwfe): void {

    if (googleResponse === null) {
      initiator.setCaptchaValid(false);
      return;
    }

    this.googleCaptchaValidateExchanger
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

  //
  // EXCHANGERS
  //

  get googleCaptchaValidateExchanger(): GoogleCaptchaValidateExchanger {
    return new GoogleCaptchaValidateExchanger(this.http);
  }

  get createAccountExchanger(): CreateAccountExchanger {
    return new CreateAccountExchanger(this.http);
  }

  get getAccountExchanger(): GetAccountExchanger {
    return new GetAccountExchanger(this.http, {accessToken: this.authtionService.accessToken});
  }

  get changePassExchanger(): ChangePassExchanger {
    return new ChangePassExchanger(this.http, {accessToken: this.authtionService.accessToken});
  }

  get reqResetPassExchanger(): ReqResetPassExchanger {
    return new ReqResetPassExchanger(this.http);
  }

  get confirmResetPassExchanger(): ConfirmResetPassExchanger {
    return new ConfirmResetPassExchanger(this.http);
  }

  get resetPassExchanger(): ResetPassExchanger {
    return new ResetPassExchanger(this.http);
  }
}




