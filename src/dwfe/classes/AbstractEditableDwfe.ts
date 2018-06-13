import {EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export abstract class AbstractEditableDwfe implements OnInit, OnDestroy {

  @Input() protected markIfChanged = false;
  protected currValue: any;
  @Input() protected initValue: any;
  protected isFirstChange = true;
  protected hasBeenChanged = false;
  @Output() protected takeHasBeenChanged = new EventEmitter<boolean>();

  @Input() protected tabIndexValue = 0;

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

  protected setHasBeenChanged(value): void {
    this.hasBeenChanged = value;
    this.takeHasBeenChanged.emit(value);
  }

  abstract cancel(value): void;
}
