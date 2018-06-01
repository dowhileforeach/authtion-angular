import {Observable, Subject} from 'rxjs';

export abstract class AbstractExchangableDwfe {
  protected isLocked = false;
  protected subjIsLocked = new Subject<boolean>();
  protected errorMessage = '';
  protected isCaptchaValid = false;

  public setLocked(value: boolean): void {
    this.isLocked = value;
    this.subjIsLocked.next(value);
  }

  public get isLocked$(): Observable<boolean> {
    return this.subjIsLocked.asObservable();
  }

  public setErrorMessage(value: string): void {
    this.errorMessage = value;
  }

  public setCaptchaValid(value: boolean): void {
    this.isCaptchaValid = value;
  }
}
