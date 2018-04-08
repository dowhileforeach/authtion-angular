import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {Subject} from 'rxjs/Subject';

import {AuthtionExchangeService} from './authtion-exchange.service';
import {AuthtionUtilsService} from './authtion-utils.service';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class AuthtionService {

  // Logging
  private subjectLoggedIn = new BehaviorSubject<boolean>(false);
  private _resultOfPerformLogin = new Subject<ReasonOfFailure>();


  constructor(private exchangeService: AuthtionExchangeService) {
  }

  isLoggedIn(): Observable<boolean> {
    return this.subjectLoggedIn.asObservable();
  }

  resultOfPerformLogin(): Observable<ReasonOfFailure> {
    return this._resultOfPerformLogin.asObservable();
  }

  private setLoggedIn(loggedIn: boolean, reason = '') {
    console.log(`setLoggedIn--${loggedIn}`);

    this.subjectLoggedIn.next(loggedIn);

    this._resultOfPerformLogin.next(ReasonOfFailure.of(loggedIn, reason));
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
        const reason = `error url=${error.url}, error=${AuthtionUtilsService.objToStr(error.error)}`;
        console.log(`service--failed Login =${reason}`);
        this.setLoggedIn(false, reason);
      }
    );
  }
}

export class ReasonOfFailure {
  private _value: boolean;
  get value(): boolean {
    return this._value;
  }

  private _reasonOfFailure: string;
  get reasonOfFailure(): string {
    return this._reasonOfFailure;
  }

  public static of(value: boolean, reasonOfFailure: string): ReasonOfFailure {
    const obj = new ReasonOfFailure();
    obj._value = value;
    obj._reasonOfFailure = reasonOfFailure;
    return obj;
  }
}
