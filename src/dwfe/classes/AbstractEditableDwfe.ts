import {EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export abstract class AbstractEditableDwfe implements OnInit, OnDestroy {

  @Input() protected markIfChanged = false;
  protected isFirstChange = true;
  protected initValue: any;
  protected hasBeenChanged = false;
  @Output() protected takeHasBeenChanged = new EventEmitter<boolean>();

  @Input() protected cancel$: Observable<boolean>;

  private _latchForUnsubscribe = new Subject();

  ngOnInit(): void {
    if (this.cancel$) {
      this.cancel$.pipe(takeUntil(this.latchForUnsubscribe))
        .subscribe(value => this.cancel(value));
    }
  }

  ngOnDestroy(): void {
    this._latchForUnsubscribe.next();
  }

  get latchForUnsubscribe(): Observable<any> {
    return this._latchForUnsubscribe.asObservable();
  }

  abstract cancel(value): void;
}
