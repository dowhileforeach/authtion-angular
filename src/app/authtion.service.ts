import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthtionService {

  private loginSubject = new BehaviorSubject<boolean>(false);

  isLoggedIn(): Observable<boolean> {
    // setTimeout(() => this.setLoggedIn(true), 3000);
    return this.loginSubject.asObservable();
  }

  setLoggedIn(value: boolean): void {
    this.loginSubject.next(value);
  }
}
