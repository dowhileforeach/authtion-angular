import {Observable, Subject} from 'rxjs';

export abstract class AbstractExchangeableDwfe implements ExchangeableDwfe {
  protected isLocked = false;
  protected subjIsLocked = new Subject<boolean>();
  protected errorMessage = '';
  protected isCaptchaValid = false;

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
