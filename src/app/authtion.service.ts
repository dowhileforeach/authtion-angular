import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {AuthtionExchangeService} from './authtion-exchange.service';
import {AuthtionUtilsService} from './authtion-utils.service';


@Injectable()
export class AuthtionService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private reasonForFailedLogin = new Subject<string>();

  isEmpty = AuthtionUtilsService.isEmpty;

  constructor(private exchangeService: AuthtionExchangeService) {
  }

  isLoggedIn(): Observable<boolean> {
    // setTimeout(() => this.setLoggedIn(true), 3000);
    return this.isLoggedInSubject.asObservable();
  }

  getPreviousLoggedInState(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  getReasonForFailedLogin(): Observable<string> {
    return this.reasonForFailedLogin.asObservable();
  }

  setLoggedIn(value: boolean, reason = ''): void {
    console.log(`setLoggedIn--${value}`);
    this.isLoggedInSubject.next(value);
    if (!value && !this.isEmpty(reason)) {
      this.reasonForFailedLogin.next(reason);
    }
  }

  performLogin(email: string, password: string) {
    this.exchangeService.post_signIn(email, password).subscribe(
      data => {
        const access_token = data['access_token'];
        const expires_in = data['expires_in'];
        const refresh_token = data['refresh_token'];

        // сохранить данные в памяти
        // сохранить данные на диск: https://netbasal.com/angular-2-persist-your-login-status-with-behaviorsubject-45da9ec43243
        // запустить регламентное задание на обновление токена

        console.log(`service--access_token=${access_token}`);

        this.setLoggedIn(true);
      },
      error => {
        console.log(`service--failed Login =${error}`);
        const reason = `error url=${error.url}, error=${AuthtionUtilsService.objToStr(error.error)}`;
        this.setLoggedIn(false, reason);
      }
    );
  }
}
