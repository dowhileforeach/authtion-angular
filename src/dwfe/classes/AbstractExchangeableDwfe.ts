import {ElementRef, OnDestroy, ViewChild} from '@angular/core';

import {BehaviorSubject, Observable, Subject} from 'rxjs';

import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

export abstract class AbstractExchangeableDwfe implements ExchangeableDwfe, OnDestroy {
  protected isLocked = false;
  protected subjIsLocked = new Subject<boolean>();

  protected errorMessage = '';
  protected successMessage = '';

  protected resetBackendError = UtilsDwfe.resetBackendError;
  protected focusOnDwfeInput = UtilsDwfe.focusOnDwfeInput;

  protected subjIsCaptchaValid = new BehaviorSubject<boolean>(false);
  protected subjIsCaptchaValidWithDelay = new BehaviorSubject<boolean>(false);
  private _latchForUnsubscribe = new Subject();

  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;

  ngOnDestroy(): void {
    this._latchForUnsubscribe.next();
  }

  get latchForUnsubscribe(): Observable<any> {
    return this._latchForUnsubscribe.asObservable();
  }

  public setLocked(value: boolean): void {
    this.isLocked = value;
    this.subjIsLocked.next(value);
    if (value) {
      this.refPendingOverlayWrap.nativeElement.focus();
    }
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
