import {EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AbstractControl, FormGroup} from '@angular/forms';

export abstract class AbstractEditableDwfe implements OnInit, OnDestroy {

  protected currValue: any;
  @Input() protected initValue: any;

  @Input() protected markIfChanged = false;
  protected isFirstChange = true;
  protected hasBeenChanged = false;
  @Output() protected takeHasBeenChanged = new EventEmitter<boolean>();

  protected group: FormGroup;
  protected control: AbstractControl;
  @Output() protected takeGroup = new EventEmitter<FormGroup>();
  @Output() protected takeControl = new EventEmitter<AbstractControl>();

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
