import {Component, OnInit} from '@angular/core';

import {takeUntil} from 'rxjs/operators';

import {AbstractEditableControlDwfe} from '@dwfe/classes/AbstractEditableControlDwfe';

@Component({
  selector: 'app-date-picker-dwfe',
  templateUrl: './date-picker.component.html'
})
export class DatePickerDwfeComponent extends AbstractEditableControlDwfe implements OnInit {

  ngOnInit(): void {
    super.ngOnInit();

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
  }
}
