import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {UtilsDwfeService} from '../../../services/utils.service';

@Injectable()
export class AuthtionExchangeService {


  private API_VERSION = '/v1';

  private clientCredentialsTrusted = { // issued token is valid for a long time, e.g. 10 days
    'id': 'Trusted',
    'password': 'YWPV#YGiGLW4Whnr3Q5vuz!d8i'
  };
  private clientCredentialsTrustedBase64Encoded =
    'Basic ' + btoa(this.clientCredentialsTrusted.id + ':' + this.clientCredentialsTrusted.password);

  private clientCredentialsUntrusted = { // the token is issued for a very short time, e.g. 3 minutes
    'id': 'Untrusted',
    'password': '4rZi5(yEhcv5Jb*3jSzGPfFFDK'
  };
  private clientCredentialsUntrustedBase64Encoded =
    'Basic ' + btoa(this.clientCredentialsUntrusted.id + ':' + this.clientCredentialsUntrusted.password);

  constructor(private http: HttpClient) {
  }


  //
  // REQUEST OPTIONS
  //

  public get opt_AuthtionReq() {
    return {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', this.clientCredentialsTrustedBase64Encoded)
    };
  }

  public get opt_JsonReq() {
    return {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };
  }


  //
  // REQUEST URLS
  //

  public get url_signIn(): string {
    return this.API_VERSION + '/sign-in';
  }

  public get url_tokenRefresh(): string {
    return this.API_VERSION + '/sign-in';
  }

  public get url_checkConsumerEmail(): string {
    return this.API_VERSION + '/check-consumer-email';
  }

  public get url_createConsumer(): string {
    return this.API_VERSION + '/create-consumer';
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


  //
  // EXCHANGERS
  //

  public post_signIn(email: string, password: string): Observable<Object> {
    return this.http.post(
      this.url_signIn,
      this.body_signIn(email, password),
      this.opt_AuthtionReq);
  }

  public post_tokenRefresh(refreshToken: string): Observable<Object> {
    return this.http.post(
      this.url_tokenRefresh,
      this.body_tokenRefresh(refreshToken),
      this.opt_AuthtionReq);
  }

  public post_checkConsumerEmail(email: string): Observable<Object> {
    return this.http.post(
      this.url_checkConsumerEmail,
      this.body_checkConsumerEmail(email),
      this.opt_JsonReq);
  }

  public post_createConsumer(email: string): Observable<Object> {
    return this.http.post(
      this.url_createConsumer,
      this.body_createConsumer(email),
      this.opt_JsonReq);
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
