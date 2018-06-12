import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {takeUntil} from 'rxjs/operators';

import {AbstractEditableDwfe} from '@dwfe/classes/AbstractEditableDwfe';

@Component({
  selector: 'app-date-picker-dwfe',
  templateUrl: './date-picker.component.html'
})
export class DatePickerDwfeComponent extends AbstractEditableDwfe implements OnInit {

  private group: FormGroup;
  private control: FormControl;
  @Output() private takeGroup = new EventEmitter<FormGroup>();

  @Input() private appearanceValue = 'fill'; // 'fill', 'standard', 'outline', and ''
  @Input() private labelText = 'Choose a date';

  @Input() private inputDisabled = false;

  ngOnInit(): void {
    super.ngOnInit();

    this.control = new FormControl();
    if (this.inputDisabled) {
      this.control.disable();
    }

    this.control.valueChanges.pipe(takeUntil(this.latchForUnsubscribe))
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

  cancel(value): void {
    if (value) {
      this.control.setValue(this.initValue);
    }
  }
}
