import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {Observable} from 'rxjs/Observable';


import {AuthtionExchangeService} from './authtion-exchange.service';
import {AuthtionUtilsService} from './authtion-utils.service';
import {Subject} from 'rxjs/Subject';


@Injectable()
export class AuthtionService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private reasonForFailedLogin = new Subject<string>();

  constructor(private exchangeService: AuthtionExchangeService) {
  }

  isLoggedIn(): Observable<boolean> {
    // setTimeout(() => this.setLoggedIn(true), 3000);
    return this.isLoggedInSubject.asObservable();
  }

  getReasonForFailedLogin(): Observable<string> {
    return this.reasonForFailedLogin.asObservable();
  }

  setLoggedIn(value: boolean, reason = ''): void {
    this.isLoggedInSubject.next(value);
    if (!value) {
      this.reasonForFailedLogin.next(reason);
    }
  }

  performLogin(email: string, password: string) {

    console.log(`email=${email}, password=${password}`);
    this.exchangeService.post_signIn(email, password).subscribe(
      data => {
        const access_token = data['access_token'];
        const expires_in = data['expires_in'];
        const refresh_token = data['refresh_token'];

        // сохранить данные в памяти
        // сохранить данные на диск
        // запустить регламентное задание на обновление токена

        this.setLoggedIn(true);
      },
      error => {
        const reason = `error url=${error.url}, error=${AuthtionUtilsService.objToStr(error.error)}`;
        this.setLoggedIn(false, reason);
      }
    );


  }

}
