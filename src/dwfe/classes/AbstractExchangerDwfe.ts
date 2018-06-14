import {HttpClient} from '@angular/common/http';

import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {ExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

export abstract class AbstractExchangerDwfe {

  private subjResult = new Subject<ResultWithDescription>();

  protected accessToken: string;

  constructor(protected http: HttpClient, private options?: any) {
    if (this.options) {
      this.accessToken = this.options['accessToken'] || '';
    }
  }

  abstract getHttpReq$(something?: any): Observable<Object>;

  //
  // STAGE 1.
  //
  performRequest(params?: any): AbstractExchangerDwfe {
    this.getHttpReq$(params).subscribe(
      response => this.responseHandler(response),
      error => this.errorHandler(error)
    );
    return this;
  }

  //
  // STAGE 2.
  //
  get result$(): Observable<ResultWithDescription> {
    return this.subjResult.asObservable();
  }

  run(initiator: ExchangeableDwfe, params: any, responseHandlerFn: any): void {

    initiator.setErrorMessage('');          // STAGE 0. Clear error message
    initiator.setLocked(true);              // STAGE 0. Initiator goes into standby mode

    this
      .performRequest(params)               // STAGE 1. Send request
      .result$                              // STAGE 2. Get result of exchange
      .pipe(
        takeUntil(initiator.isLocked$())    // just in case, although with the current scheme it is not necessary
      )
      .subscribe(
        (data: ResultWithDescription) => {
          responseHandlerFn(data);          // STAGE 3. Process result
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

  static of(param): ResultWithDescription {
    const result = param.result || false;
    const description = param.description || '';

    const obj = new ResultWithDescription();
    obj._result = result;
    obj._data = param.data;
    obj._description = description;
    return obj;
  }
}
