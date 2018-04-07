import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {Observable} from 'rxjs/Observable';


import {AuthtionExchangeService} from './authtion-exchange.service';
import {AuthtionUtilsService} from './authtion-utils.service';


@Injectable()
export class AuthtionService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private exchangeService: AuthtionExchangeService) {
  }

  isLoggedIn(): Observable<boolean> {
    // setTimeout(() => this.setLoggedIn(true), 3000);
    return this.isLoggedInSubject.asObservable();
  }

  setLoggedIn(value: boolean): void {
    this.isLoggedInSubject.next(value);
  }

  performLogin(email: string, password: string) {

    console.log(`email=${email}, password=${password}`);
    this.exchangeService.post_signIn(email, password).subscribe(
      data => console.log(data),
      error => console.log(`error url=${error.url}, error=${AuthtionUtilsService.objToStr(error.error)}`)
    );


  }

}
