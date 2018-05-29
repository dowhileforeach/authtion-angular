import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable, Subject, timer} from 'rxjs';
import {map, switchMapTo, take} from 'rxjs/operators';

import {UtilsDwfeService} from '@dwfe/services/utils.service';

const API_VERSION = '/v1';

const endpoints = {
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

const credentials = {
  trusted: { // issued token is valid for a long time, e.g. 20 days
    name: 'Trusted',
    password: 'YWPVYGiGLW4Whnr3Q5vuzd8i'
  },
  untrusted: { // the token is issued for a very short time, e.g. 3 minutes
    name: 'Untrusted',
    password: '4rZi5yEhcv5Jb3jSzGPfFFDK'
  }
};

const credentialsBase64Encoded = {
  trusted: 'Basic ' + btoa(credentials.trusted.name + ':' + credentials.trusted.password),
  untrusted: 'Basic ' + btoa(credentials.untrusted.name + ':' + credentials.untrusted.password)
};

@Injectable()
export class AuthtionExchangeService {

  private subjPerform__googleCaptchaValidate = new Subject<ResultWithDescription>();
  private subjPerform__getAccount = new Subject<ResultWithDescription>();
  private subjPerform__createAccount = new Subject<ResultWithDescription>();
  private subjPerform__reqRestorePass = new Subject<ResultWithDescription>();

  constructor(private http: HttpClient) {
  }

  public get perform__googleCaptchaValidate(): Observable<ResultWithDescription> {
    return this.subjPerform__googleCaptchaValidate.asObservable();
  }

  public get perform__getAccount(): Observable<ResultWithDescription> {
    return this.subjPerform__getAccount.asObservable();
  }

  public get perform__createAccount(): Observable<ResultWithDescription> {
    return this.subjPerform__createAccount.asObservable();
  }

  public get perform__reqRestorePass(): Observable<ResultWithDescription> {
    return this.subjPerform__reqRestorePass.asObservable();
  }

  private static handleResponse(response, subject: Subject<ResultWithDescription>): void {
    if (response['success']) {
      subject.next(ResultWithDescription.of({
        result: true,
        data: response['data']
      }));
    } else {
      subject.next(ResultWithDescription.of({description: UtilsDwfeService.getReadableErrorFromDwfeServer(response)}));
    }
  }

  public static handleError(error, subject): void {
    subject.next(ResultWithDescription.of({description: UtilsDwfeService.getReadableExchangeError(error)}));
  }

  public performGoogleCaptchaValidate(googleResponse: string): void {
    this.post_googleCaptchaValidate(googleResponse).subscribe(
      response => AuthtionExchangeService.handleResponse(response, this.subjPerform__googleCaptchaValidate),
      error => AuthtionExchangeService.handleError(error, this.subjPerform__googleCaptchaValidate)
    );
  }

  public performGetAccount(accessToken: string): void {
    this.get_getAccount(accessToken).subscribe(
      response => AuthtionExchangeService.handleResponse(response, this.subjPerform__getAccount),
      error => AuthtionExchangeService.handleError(error, this.subjPerform__getAccount)
    );
  }

  public performCreateAccount(email: string): void {
    this.post_createAccount(email).subscribe(
      response => AuthtionExchangeService.handleResponse(response, this.subjPerform__createAccount),
      error => AuthtionExchangeService.handleError(error, this.subjPerform__createAccount)
    );
  }

  public performReqRestorePass(email: string): void {
    this.post_reqRestorePass(email).subscribe(
      response => AuthtionExchangeService.handleResponse(response, this.subjPerform__reqRestorePass),
      error => AuthtionExchangeService.handleError(error, this.subjPerform__reqRestorePass)
    );
  }

  //
  // REQUEST OPTIONS
  //

  public get opt_AuthReq() {
    return {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', credentialsBase64Encoded.trusted)
    };
  }

  public get opt_PostAnonymouseReq() {
    return {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };
  }

  public opt_GetAuthReq(accessToken: string) {
    return {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    };
  }


  //
  // REQUEST BODIES
  //

  public body_signIn(email: string, password: string): HttpParams {
    return new HttpParams()
      .set('grant_type', 'password')
      .set('username', email)
      .set('password', password);
  }

  public body_tokenRefresh(refreshToken: string): HttpParams {
    return new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);
  }

  public body_googleCaptchaValidate(googleResponse: string): string {
    return `{
              "googleResponse": "${googleResponse}"
            }`;
  }

  public body_checkEmail(email: string): string {
    return `{
              "email": "${email}"
            }`;
  }

  public body_createAccount(email: string): string {
    return `{
              "email": "${email}"
            }`;
  }

  public body_reqRestorePass(email: string): string {
    return `{
              "email": "${email}"
            }`;
  }

  // update-account


  //
  // EXCHANGERS
  //

  public post_signIn(email: string, password: string): Observable<Object> {
    return this.http.post(
      endpoints.signIn,
      this.body_signIn(email, password),
      this.opt_AuthReq);
  }

  public post_tokenRefresh(refreshToken: string): Observable<Object> {
    return this.http.post(
      endpoints.tokenRefresh,
      this.body_tokenRefresh(refreshToken),
      this.opt_AuthReq);
  }

  public post_googleCaptchaValidate(googleResponse: string): Observable<Object> {
    return this.http.post(
      endpoints.googleCaptchaValidate,
      this.body_googleCaptchaValidate(googleResponse),
      this.opt_PostAnonymouseReq);
  }

  public get_signOut(accessToken: string): Observable<Object> {
    return this.http.get(
      endpoints.signOut,
      this.opt_GetAuthReq(accessToken)
    );
  }

  public post_checkEmail(email: string): Observable<Object> {
    return this.http.post(
      endpoints.checkEmail,
      this.body_checkEmail(email),
      this.opt_PostAnonymouseReq);
  }

  public post_createAccount(email: string): Observable<Object> {
    return this.http.post(
      endpoints.createAccount,
      this.body_createAccount(email),
      this.opt_PostAnonymouseReq);
  }

  public post_reqRestorePass(email: string): Observable<Object> {
    return this.http.post(
      endpoints.reqRestorePass,
      this.body_reqRestorePass(email),
      this.opt_PostAnonymouseReq);
  }

  // update-account

  public get_getAccount(accessToken: string): Observable<Object> {
    return this.http.get(
      endpoints.getAccount,
      this.opt_GetAuthReq(accessToken)
    );
  }

  //
  // BACKEND VALIDATORS
  //
  public backendValidatorEmail(email, reverseHandleResp) {
    const observable = this.post_checkEmail(email);

    // Don't send request to the backend on keyup. Only the last result for the interval.
    // Based on: https://github.com/angular/angular/issues/6895#issuecomment-329464982
    const debounceTime = 500; // ms

    if (reverseHandleResp) { // for 'Login'

      return timer(debounceTime).pipe(
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

      return timer(debounceTime).pipe(
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

    // let's run the verification process
    this.performGoogleCaptchaValidate(googleResponse);

    // wait for service response
    source.setLocked(true);

    // process service response
    const subscription_googleCaptchaValidate = this.perform__googleCaptchaValidate.subscribe(
      data => {
        if (data.result) { // actions on success captcha check
          source.setCaptchaValid(true);
        } else {
          source.setErrorMessageOfCaptcha(data.description);
        }
        subscription_googleCaptchaValidate.unsubscribe();
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
