import {OnDestroy} from '@angular/core';

import {Observable, Subject} from 'rxjs';

import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';
import {BehaviorSubject} from 'rxjs/index';

export abstract class AbstractExchangeableDwfe implements ExchangeableDwfe, OnDestroy {
  protected isLocked = false;
  protected subjIsLocked = new Subject<boolean>();
  protected errorMessage = '';

  protected resetBackendError = UtilsDwfe.resetBackendError;
  protected focusOnDwfeInput = UtilsDwfe.focusOnDwfeInput;

  protected subjIsCaptchaValid = new BehaviorSubject<boolean>(false);
  protected subjIsCaptchaValidWithDelay = new BehaviorSubject<boolean>(false);
  protected latchForUnsubscribe = new Subject();

  ngOnDestroy(): void {
    this.latchForUnsubscribe.next();
  }

  public setLocked(value: boolean): void {
    this.isLocked = value;
    this.subjIsLocked.next(value);
  }

  public getIsLocked$(): Observable<boolean> {
    return this.subjIsLocked.asObservable();
  }

  public setErrorMessage(value: string): void {
    this.errorMessage = value;
  }

  public setCaptchaValid(value: boolean): void {
    this.subjIsCaptchaValid.next(value);
    setTimeout(() => this.subjIsCaptchaValidWithDelay.next(value), 20);
  }

  public get isCaptchaValid$(): Observable<boolean> {
    return this.subjIsCaptchaValid.asObservable();
  }

  public get isCaptchaValidWithDelay$(): Observable<boolean> {
    return this.subjIsCaptchaValidWithDelay.asObservable();
  }
}

export interface ExchangeableDwfe {
  setLocked(value: boolean): void;

  getIsLocked$(): Observable<boolean>;

  setErrorMessage(value: string): void;

  setCaptchaValid(value: boolean): void;
}
