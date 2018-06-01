import {HttpClient} from '@angular/common/http';

import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AbstractExchangableDwfe} from '@dwfe/classes/AbstractExchangableDwfe';
import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

export abstract class AbstractExchangerDwfe {

  private subjResult = new Subject<ResultWithDescription>();

  protected constructor(protected http: HttpClient) {
  }

  public static optionsForAnonymouseReq() {
    return {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };
  }

  public static optionsForAuthorizedReq(accessToken: string) {
    return {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + accessToken
      }
    };
  }

  public static bodySimple(propName: string, propValue: string): string {
    return `{
              "${propName}": "${propValue}"
            }`;
  }

  abstract getHttpReq$(params?: any): Observable<Object>;

  //
  // STAGE 1.
  //
  public performRequest(params?: any): AbstractExchangerDwfe {
    this.getHttpReq$(params).subscribe(
      response => this.responseHandler(response),
      error => this.errorHandler(error)
    );
    return this;
  }

  //
  // STAGE 2.
  //
  public get result$(): Observable<ResultWithDescription> {
    return this.subjResult.asObservable();
  }

  public run(initiator: AbstractExchangableDwfe, params: any, responseHandlerFn: any): void {

    initiator.setErrorMessage('');         // STAGE 0. Clear error message
    initiator.setLocked(true);             // STAGE 0. Initiator goes into standby mode

    this
      .performRequest(params)              // STAGE 1. Send request
      .result$                             // STAGE 2. Get result of exchange
      .pipe(
        takeUntil(initiator.isLocked$)     // just in case, although here it is not necessary
      )
      .subscribe(
        (data: ResultWithDescription) => {
          responseHandlerFn(data);         // STAGE 3. Process result
          initiator.setLocked(false);
        });
  }

  private responseHandler(response): void {
    if (response['success']) {
      this.subjResult.next(ResultWithDescription.of({
        result: true,
        data: response['data']
      }));
    } else {
      this.subjResult.next(ResultWithDescription.of({
        description: UtilsDwfe.getReadableErrorFromDwfeServer(response)
      }));
    }
  }

  private errorHandler(error): void {
    this.subjResult.next(ResultWithDescription.of({
      description: UtilsDwfe.getReadableExchangeError(error)
    }));
  }
}

export class ResultWithDescription {

  private _result: boolean;
  private _data: any;
  private _description: string;

  get result(): boolean {
    return this._result;
  }

  get data(): any {
    return this._data;
  }

  get description(): string {
    return this._description;
  }

  public static of(param): ResultWithDescription {
    const result = param.result || false;
    const description = param.description || '';

    const obj = new ResultWithDescription();
    obj._result = result;
    obj._data = param.data;
    obj._description = description;
    return obj;
  }
}
