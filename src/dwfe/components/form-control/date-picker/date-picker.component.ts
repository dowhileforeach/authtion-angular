import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {takeUntil} from 'rxjs/operators';

import {AbstractEditableDwfe} from '@dwfe/classes/AbstractEditableDwfe';

@Component({
  selector: 'app-date-picker-dwfe',
  templateUrl: './date-picker.component.html'
})
export class DatePickerDwfeComponent extends AbstractEditableDwfe implements OnInit {

  @Input() private appearanceValue = 'fill'; // 'fill', 'standard', 'outline', and ''
  @Input() private labelText = 'Choose a date';

  @Input() private inputDisabled = false;

  ngOnInit(): void {
    super.ngOnInit();

    this.group = new FormGroup({
      'date': new FormControl()
    });
    this.control = this.group.get('date');
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
        let hasBeenChanged = value !== this.initValue;
        if (value && this.initValue) {
          hasBeenChanged = value.setHours(0, 0, 0, 0) !== this.initValue.setHours(0, 0, 0, 0);
        }
        this.setHasBeenChanged(hasBeenChanged);
      });
    this.takeGroup.emit(this.group);
    this.takeControl.emit(this.control);
  }

  cancel(value): void {
    if (value) {
      this.control.setValue(this.initValue);
    }
  }
}
