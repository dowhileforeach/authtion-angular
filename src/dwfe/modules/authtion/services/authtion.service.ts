import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {AuthtionExchangeService} from './authtion-exchange.service';
import {UtilsDwfeService} from '../../../services/utils.service';

@Injectable()
export class AuthtionService {

  private subjectLoggedIn = new BehaviorSubject<boolean>(false);
  private resultOfPerformLogin = new Subject<ReasonOfFailure>();

  constructor(private exchangeService: AuthtionExchangeService) {
  }

  public getLoggedIn(): Observable<boolean> {
    return this.subjectLoggedIn.asObservable();
  }

  public getResultOfPerformLogin(): Observable<ReasonOfFailure> {
    return this.resultOfPerformLogin.asObservable();
  }

  private setLoggedIn(loggedIn: boolean, reason = ''): void {

    this.subjectLoggedIn.next(loggedIn);

    this.resultOfPerformLogin.next(ReasonOfFailure.of(loggedIn, reason));
  }

  public performLogin(email: string, password: string): void {
    this.exchangeService.post_signIn(email, password).subscribe(
      data => {
        const access_token = data['access_token'];
        const expires_in = data['expires_in'];
        const refresh_token = data['refresh_token'];

        // сохранить данные в памяти
        // сохранить данные на диск: https://netbasal.com/angular-2-persist-your-login-status-with-behaviorsubject-45da9ec43243
        // запустить регламентное задание на обновление токена

        this.setLoggedIn(true);
      },
      error =>
        this.setLoggedIn(false, UtilsDwfeService.getReadableHttpError(error))
    );
  }

}

export class ReasonOfFailure {

  private _value: boolean;
  private _reasonOfFailure: string;

  get value(): boolean {
    return this._value;
  }

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
