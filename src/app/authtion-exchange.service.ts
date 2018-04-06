import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AuthtionExchangeService {

  private PROTOCOL_DOMEN_PORT_VERSION = 'http://localhost:8080/v1';

  constructor(private http: HttpClient) {
  }

  /*
   * REQUEST OPTIONS
   */


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

  public get url_checkConsumerEmail(): string {
    return this.PROTOCOL_DOMEN_PORT_VERSION + '/check-consumer-email';
  }

  public get url_createConsumer(): string {
    return this.PROTOCOL_DOMEN_PORT_VERSION + '/create-consumer';
  }

  /*
   * REQUEST BODIES
   */

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
   * RESPONSE OBSERVABLES
   */

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
