import {OnDestroy} from '@angular/core';

import {Observable, Subject} from 'rxjs';

import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

export abstract class AbstractExchangeableDwfe implements ExchangeableDwfe, OnDestroy {
  protected isLocked = false;
  protected subjIsLocked = new Subject<boolean>();
  protected errorMessage = '';
  protected isCaptchaValid = false;

  protected resetBackendError = UtilsDwfe.resetBackendError;
  protected focusOnDwfeInput = UtilsDwfe.focusOnDwfeInput;

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
    this.isCaptchaValid = value;
  }
}

export interface ExchangeableDwfe {
  setLocked(value: boolean): void;

  getIsLocked$(): Observable<boolean>;

  setErrorMessage(value: string): void;

  setCaptchaValid(value: boolean): void;
}
