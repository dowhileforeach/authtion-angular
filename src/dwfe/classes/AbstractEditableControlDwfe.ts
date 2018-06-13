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
  @Input() protected tabIndexValue = 0;

  @Input() protected markIfChanged = false;
  @Input() protected initValue: any;
  protected isFirstChange = true;
  protected isChanged = false;
  protected compareAs = ''; // 'textField', 'dateField', and ''
  @Output() protected takeIsChanged = new EventEmitter<boolean>();

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

    this.control.valueChanges.pipe(takeUntil(this.latchForUnsubscribe)).subscribe((value: any) => {
      if (this.doINeedToCompare(value)) {

        let isChanged = value !== this.initValue;

        if (this.compareAs === 'textField') {
          if (!this.initValue && value === '') {
            isChanged = false; // if init=null and has been changed to ''
          }
        } else if (this.compareAs === 'dateField') {
          if (value && this.initValue) {
            isChanged = value.setHours(0, 0, 0, 0) !== this.initValue.setHours(0, 0, 0, 0);
          }
        }

        this.setIsChanged(isChanged);
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

  protected doINeedToCompare(value): boolean {
    if (this.isFirstChange) {
      this.isFirstChange = false;
      this.initValue = value;
      return false;
    }
    return true;
  }

  protected setIsChanged(value): void {
    this.isChanged = value;
    this.takeIsChanged.emit(value);
  }

  protected cancelEdit(value): void {
    if (value) {
      this.control.setValue(this.initValue);
    }
  }
}
