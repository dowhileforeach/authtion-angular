import {EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export abstract class AbstractEditableDwfe implements OnInit, OnDestroy {

  protected group: FormGroup;
  protected control: AbstractControl;
  @Output() protected takeGroup = new EventEmitter<FormGroup>();
  @Output() protected takeControl = new EventEmitter<AbstractControl>();

  @Input() protected labelText = '';
  @Input() protected appearanceValue = 'fill'; // 'fill', 'standard', 'outline', and ''
  @Input() protected controlIsDisabled = false;
  @Input() protected tabIndexValue = 0;

  @Input() protected markIfChanged = false;
  @Input() protected initValue: any;
  protected isFirstChange = true;
  protected hasBeenChanged = false;
  @Output() protected takeHasBeenChanged = new EventEmitter<boolean>();

  @Input() protected cancel$: Observable<boolean>;

  private _latchForUnsubscribe = new Subject();
  protected get latchForUnsubscribe(): Observable<any> {
    return this._latchForUnsubscribe.asObservable();
  }

  ngOnInit(): void {
    this.group = new FormGroup({
      'ctrl': new FormControl()
    });
    this.control = this.group.get('ctrl');
    this.takeGroup.emit(this.group);
    this.takeControl.emit(this.control);

    if (this.cancel$) {
      this.cancel$.pipe(takeUntil(this.latchForUnsubscribe))
        .subscribe(value => this.cancel(value));
    }
  }

  ngOnDestroy(): void {
    this._latchForUnsubscribe.next();
  }

  protected setHasBeenChanged(value): void {
    this.hasBeenChanged = value;
    this.takeHasBeenChanged.emit(value);
  }

  protected cancel(value): void {
    if (value) {
      this.control.setValue(this.initValue);
    }
  }
}
