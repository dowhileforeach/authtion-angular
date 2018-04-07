import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class AuthtionExchangeService {

  private API_VERSION = '/v1';

  private clientCredentialsTrusted = { // issued token is valid for a long time, e.g. 10 days
    'id': 'Trusted',
    'password': 'YWPV#YGiGLW4Whnr3Q5vuz!d8i'
  };
  private clientCredentialsUntrusted = { // the token is issued for a very short time, e.g. 3 minutes
    'id': 'Untrusted',
    'password': '4rZi5(yEhcv5Jb*3jSzGPfFFDK'
  };
  private clientCredentialsTrustedBase64Encoded = 'Basic ' + btoa(this.clientCredentialsTrusted.id + ':' + this.clientCredentialsTrusted.password);
  private clientCredentialsUntrustedBase64Encoded = 'Basic ' + btoa(this.clientCredentialsUntrusted.id + ':' + this.clientCredentialsUntrusted.password);

  constructor(private http: HttpClient) {
  }


  /*
   * REQUEST OPTIONS
   */

  public opt_AuthtionReq() {
    return {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', this.clientCredentialsTrustedBase64Encoded)
    };
  }

  public opt_JsonReq() {
    return {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };
  }


  /*
   * REQUEST URLS
   */

  public get url_signIn(): string {
    return this.API_VERSION + '/sign-in';
  }

  public get url_checkConsumerEmail(): string {
    return this.API_VERSION + '/check-consumer-email';
  }

  public get url_createConsumer(): string {
    return this.API_VERSION + '/create-consumer';
  }


  /*
   * REQUEST BODIES
   */

  public body_signIn(email: string, password: string): HttpParams {
    return new HttpParams()
      .set('grant_type', 'password')
      .set('username', email)
      .set('password', password);
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


  /*
   * EXCHANGERS
   */

  public post_signIn(email: string, password: string): Observable<Object> {
    return this.http.post(
      this.url_signIn,
      this.body_signIn(email, password),
      this.opt_AuthtionReq());
  }

  public post_checkConsumerEmail(email: string): Observable<Object> {
    return this.http.post(
      this.url_checkConsumerEmail,
      this.body_checkConsumerEmail(email),
      this.opt_JsonReq());
  }

  public post_createConsumer(email: string): Observable<Object> {
    return this.http.post(
      this.url_createConsumer,
      this.body_createConsumer(email),
      this.opt_JsonReq());
  }
}
