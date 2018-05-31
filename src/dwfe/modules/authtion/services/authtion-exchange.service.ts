import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {interval, Observable, Subject} from 'rxjs';
import {map, switchMapTo, take} from 'rxjs/operators';

import {UtilsDwfeService} from '@dwfe/services/utils.service';

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
      AuthtionAbstractExchanger.bodySimple('email', email),
      AuthtionAbstractExchanger.optionsForAnonymouseReq());
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
            return {'backendHttp': UtilsDwfeService.getReadableExchangeError(error)};
          }),
        take(1)
      );

    } else { // for 'Create account'

      return interval(debounceTime).pipe(
        switchMapTo(observable),
        map(
          response => {
            if (!response['success']) {
              return {'backendHttp': UtilsDwfeService.getReadableErrorFromDwfeServer(response)};
            }
            return null;
          },
          error => {
            return {'backendHttp': UtilsDwfeService.getReadableExchangeError(error)};
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
  public checkGoogleCaptcha(googleResponse: string, source: GoogleCaptchaProcess): void {

    source.setErrorMessageOfCaptcha(''); // init

    if (googleResponse === null) {
      source.setCaptchaValid(false);
      return;
    }

    // waiting for response
    source.setLocked(true);

    GoogleCaptchaValidateExchange.of(this)
      .performRequest({googleResponse: googleResponse})
      .result$.subscribe(
      data => {
        if (data.result) { // actions on success captcha check
          source.setCaptchaValid(true);
        } else {
          source.setErrorMessageOfCaptcha(data.description);
        }
        source.setLocked(false);
      }
    );
  }
}

export class ResultWithDescription {

  private _result: boolean;
  private _data: any;
  private _description: string;

  get result(): boolean {
    return this._result;
  }

  get data(): any {
    return this._data;
  }

  get description(): string {
    return this._description;
  }

  public static of(param): ResultWithDescription {
    const result = param.result || false;
    const description = param.description || '';

    const obj = new ResultWithDescription();
    obj._result = result;
    obj._data = param.data;
    obj._description = description;
    return obj;
  }
}

export interface GoogleCaptchaProcess {
  setLocked(value: boolean): void;

  setErrorMessageOfCaptcha(value: string): void;

  setCaptchaValid(value: boolean): void;
}

export interface ExchangeInitiator {
  setLocked(value: boolean): void;

  setErrorMessageOfExchange(value: string): void;
}

export abstract class AuthtionAbstractExchanger {

  private subjResult = new Subject<ResultWithDescription>();

  constructor(protected exchangeService: AuthtionExchangeService) {
  }

  public static optionsForAnonymouseReq() {
    return {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };
  }

  public static optionsForAuthorizedReq(accessToken: string) {
    return {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + accessToken
      }
    };
  }

  public static bodySimple(propName: string, propValue: string): string {
    return `{
              "${propName}": "${propValue}"
            }`;
  }

  public run(source: ExchangeInitiator, params: any, fnRequestHandlingLogic: any): void {

    source.setErrorMessageOfExchange('');

    // waiting for response
    source.setLocked(true);

    this
      .performRequest(params)
      .result$.subscribe(
      data => fnRequestHandlingLogic(data)
    );
  }

  public get result$(): Observable<ResultWithDescription> {
    return this.subjResult.asObservable();
  }

  public performRequest(params?: any): AuthtionAbstractExchanger {
    this.getHttpReq$(params).subscribe(
      response => this.handleResponse(response),
      error => this.handleError(error)
    );
    return this;
  }

  abstract getHttpReq$(params?: any): Observable<Object>;

  private handleResponse(response): void {
    if (response['success']) {
      this.subjResult.next(ResultWithDescription.of({
        result: true,
        data: response['data']
      }));
    } else {
      this.subjResult.next(ResultWithDescription.of({
        description: UtilsDwfeService.getReadableErrorFromDwfeServer(response)
      }));
    }
  }

  private handleError(error): void {
    this.subjResult.next(ResultWithDescription.of({
      description: UtilsDwfeService.getReadableExchangeError(error)
    }));
  }
}

export class GoogleCaptchaValidateExchange extends AuthtionAbstractExchanger {
  static of(exchangeService: AuthtionExchangeService): GoogleCaptchaValidateExchange {
    return new GoogleCaptchaValidateExchange(exchangeService);
  }

  getHttpReq$(params?: any): Observable<Object> {
    return this.exchangeService.http.post(
      endpoints.googleCaptchaValidate,
      AuthtionAbstractExchanger.bodySimple('googleResponse', params.googleResponse),
      AuthtionAbstractExchanger.optionsForAnonymouseReq());
  }
}

export class CreateAccountExchange extends AuthtionAbstractExchanger {
  static of(exchangeService: AuthtionExchangeService): CreateAccountExchange {
    return new CreateAccountExchange(exchangeService);
  }

  getHttpReq$(params?: any): Observable<Object> {
    return this.exchangeService.http.post(
      endpoints.createAccount,
      AuthtionAbstractExchanger.bodySimple('email', params.email),
      AuthtionAbstractExchanger.optionsForAnonymouseReq());
  }
}

export class GetAccountExchange extends AuthtionAbstractExchanger {
  static of(exchangeService: AuthtionExchangeService): GetAccountExchange {
    return new GetAccountExchange(exchangeService);
  }

  getHttpReq$(params?: any): Observable<Object> {
    return this.exchangeService.http.get(
      endpoints.getAccount,
      AuthtionAbstractExchanger.optionsForAuthorizedReq(params.accessToken)
    );
  }
}

export class ReqRestorePassExchanger extends AuthtionAbstractExchanger {
  static of(exchangeService: AuthtionExchangeService): ReqRestorePassExchanger {
    return new ReqRestorePassExchanger(exchangeService);
  }

  getHttpReq$(params?: any): Observable<Object> {
    return this.exchangeService.http.post(
      endpoints.reqRestorePass,
      AuthtionAbstractExchanger.bodySimple('email', params.email),
      AuthtionAbstractExchanger.optionsForAnonymouseReq());
  }
}




