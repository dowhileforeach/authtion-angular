import {EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export abstract class AbstractEditableControlDwfe implements OnInit, OnDestroy {

  protected group: FormGroup;
  protected control: AbstractControl;
  protected validators: any[];
  protected asyncValidators: any[];
  @Output() protected takeGroup = new EventEmitter<FormGroup>();
  @Output() protected takeControl = new EventEmitter<AbstractControl>();

  @Input() protected labelText = '';
  @Input() protected hintText = '';
  @Input() protected appearanceValue = 'fill'; // 'fill', 'standard', 'outline', and ''
  @Input() protected disableControl = false;
  @Input() protected tabIndexValue = 0;

  @Input() protected markIfChanged = false;
  @Input() protected initValue: any;
  protected isFirstChange = true;
  protected hasBeenChanged = false;
  protected compareAs = '';
  @Output() protected takeHasBeenChanged = new EventEmitter<boolean>();

  @Input() protected cancelEdit$: Observable<boolean>;

  private _latchForUnsubscribe = new Subject();
  protected get latchForUnsubscribe(): Observable<any> {
    return this._latchForUnsubscribe.asObservable();
  }

  ngOnInit(): void {
    this.group = new FormGroup({
      'ctrl': new FormControl('', this.validators, this.asyncValidators)
    });

    this.control = this.group.get('ctrl');
    if (this.disableControl) {
      this.control.disable();
    }

    this.control.valueChanges.pipe(takeUntil(this.latchForUnsubscribe)).subscribe((value: any) => {
      if (this.doINeedToCheck(value)) {

        let hasBeenChanged = value !== this.initValue;

        if (this.compareAs === 'textField') {
          if (!this.initValue && value === '') {
            hasBeenChanged = false; // if init=null and has been changed to ''
          }
        } else if (this.compareAs === 'dateField') {
          if (value && this.initValue) {
            hasBeenChanged = value.setHours(0, 0, 0, 0) !== this.initValue.setHours(0, 0, 0, 0);
          }
        }

        this.setHasBeenChanged(hasBeenChanged);
      }
    });

    if (this.cancelEdit$) {
      this.cancelEdit$.pipe(takeUntil(this.latchForUnsubscribe))
        .subscribe(value => this.cancelEdit(value));
    }

    this.takeGroup.emit(this.group);
    this.takeControl.emit(this.control);
  }

  ngOnDestroy(): void {
    this._latchForUnsubscribe.next();
  }

  protected setHasBeenChanged(value): void {
    this.hasBeenChanged = value;
    this.takeHasBeenChanged.emit(value);
  }

  protected cancelEdit(value): void {
    if (value) {
      this.control.setValue(this.initValue);
    }
  }

  protected doINeedToCheck(value): boolean {
    if (this.isFirstChange) {
      this.isFirstChange = false;
      this.initValue = value;
      return false;
    }
    return true;
  }
}
