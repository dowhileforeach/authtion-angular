export abstract class AbstractExchangableDwfe {
  protected isLocked = false;
  protected errorMessage = '';
  protected isCaptchaValid = false;

  abstract setLocked(value: boolean): void;

  public setErrorMessage(value: string): void {
    this.errorMessage = value;
  }

  public setCaptchaValid(value: boolean): void {
    this.isCaptchaValid = value;
  }
}
