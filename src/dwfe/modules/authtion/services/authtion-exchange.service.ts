import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {UtilsDwfeService} from '@dwfe/services/utils.service';

const API_VERSION = '/v1';

const endpoints = {
  signIn: `${API_VERSION}/sign-in`,
  tokenRefresh: `${API_VERSION}/sign-in`,
  googleCaptchaValidate: `${API_VERSION}/google-captcha-validate`,
  signOut: `${API_VERSION}/sign-out`,
  checkConsumerEmail: `${API_VERSION}/check-consumer-email`,
  createConsumer: `${API_VERSION}/create-consumer`,
  updateConsumer: `${API_VERSION}/update-consumer`,
  getConsumerData: `${API_VERSION}/get-consumer-data`,
};

const credentials = {
  trusted: { // issued token is valid for a long time, e.g. 10 days
    name: 'Trusted',
    password: 'YWPV#YGiGLW4Whnr3Q5vuz!d8i'
  },
  untrusted: { // the token is issued for a very short time, e.g. 3 minutes
    name: 'Untrusted',
    password: '4rZi5(yEhcv5Jb*3jSzGPfFFDK'
  }
};

const credentialsBase64Encoded = {
  trusted: 'Basic ' + btoa(credentials.trusted.name + ':' + credentials.trusted.password),
  untrusted: 'Basic ' + btoa(credentials.untrusted.name + ':' + credentials.untrusted.password)
};

@Injectable()
export class AuthtionExchangeService {

  constructor(private http: HttpClient) {
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

  public body_checkConsumerEmail(email: string): string {
    return `{
              "email": "${email}"
            }`;
  }

  public body_createConsumer(email: string): string {
    return `{
              "email": "${email}"
            }`;
  }

  // update-consumer


  //
  // EXCHANGERS
  //

  public post_signIn(email: string, password: string): Observable<Object> {
    console.log(endpoints.signIn);
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

  public post_checkConsumerEmail(email: string): Observable<Object> {
    return this.http.post(
      endpoints.checkConsumerEmail,
      this.body_checkConsumerEmail(email),
      this.opt_PostAnonymouseReq);
  }

  public post_createConsumer(email: string): Observable<Object> {
    return this.http.post(
      endpoints.createConsumer,
      this.body_createConsumer(email),
      this.opt_PostAnonymouseReq);
  }

  // update-consumer

  public get_getConsumerData(accessToken: string): Observable<Object> {
    return this.http.get(
      endpoints.getConsumerData,
      this.opt_GetAuthReq(accessToken)
    );
  }


  //
  // BACKEND VALIDATORS
  //

  public backendValidatorEmail(email, reverseHandleResp) {
    const observable = this.post_checkConsumerEmail(email).retry(3);

    // Don't send request to the backend on keyup. Only the last result for the interval.
    // Based on: https://github.com/angular/angular/issues/6895#issuecomment-329464982
    const debounceTime = 500; // ms

    if (reverseHandleResp) { // for 'Login'

      return Observable.timer(debounceTime).switchMapTo(observable).map(
        data => {
          if (data['success']) {
            return {'backendHttp': 'Not found in our database'};
          } else if (data['details']['email'] !== 'is already present in our database') {
            return {'backendHttp': UtilsDwfeService.objToStr(data['details'])};
          }
          return null;
        }).take(1);

    } else { // for 'Create account'

      return Observable.timer(debounceTime).switchMapTo(observable).map(
        data => {
          if (data['success']) {
            return null;
          } else {
            return {'backendHttp': UtilsDwfeService.objToStr(data['details'])};
          }
        }).take(1);
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
    //         data['success'] ? resolve(null) : resolve({'backendHttp': this.objToStr(data['details'])});
    //         this.emailControl.markAsTouched();
    //       },
    //       error => resolve({'http': error.message})
    //     );
    //   });
  }
}
