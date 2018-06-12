import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-date-picker-dwfe',
  templateUrl: './date-picker.component.html'
})
export class DatePickerDwfeComponent implements OnInit, OnDestroy {

  private group: FormGroup;
  private control: FormControl;
  @Output() private takeGroup = new EventEmitter<FormGroup>();

  @Input() private appearanceValue = 'fill'; // 'fill', 'standard', 'outline', and ''
  @Input() private labelText = 'Choose a date';

  @Input() private inputDisabled = false;

  @Input() private markIfChanged = false;
  private isFirstChange = true;
  private initValue: Date;
  private hasBeenChanged = false;
  @Output() private takeHasBeenChanged = new EventEmitter<boolean>();

  private latchForUnsubscribe = new Subject();

  ngOnInit(): void {
    this.control = new FormControl();
    if (this.inputDisabled) {
      this.control.disable();
    }

    this.control.valueChanges.pipe(takeUntil(this.latchForUnsubscribe.asObservable()))
      .subscribe((value: Date) => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
          this.initValue = value;
          return;
        }
        if (value && this.initValue) {
          this.hasBeenChanged = value.setHours(0, 0, 0, 0) !== this.initValue.setHours(0, 0, 0, 0);
        } else {
          this.hasBeenChanged = value !== this.initValue;
        }
        this.takeHasBeenChanged.emit(this.hasBeenChanged);
      });

    this.group = new FormGroup({
      'date': this.control
    });

    this.takeGroup.emit(this.group);
  }

  ngOnDestroy(): void {
    this.latchForUnsubscribe.next();
  }
}
