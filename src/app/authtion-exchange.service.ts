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


  /*
   * REQUEST BODIES
   */

  public body_checkConsumerEmail(email: string): string {
    return `{
              "email": "${email}"
            }`;
  }


  public post_checkConsumerEmail(email: string): Observable<Object> {
    return this.http.post(
      this.url_checkConsumerEmail,
      this.body_checkConsumerEmail(email),
      this.opt_JsonReq());
  }


}
