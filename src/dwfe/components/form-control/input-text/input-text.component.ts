import {Component, OnInit} from '@angular/core';

import {takeUntil} from 'rxjs/operators';

import {AbstractEditableControlDwfe} from '@dwfe/classes/AbstractEditableControlDwfe';

@Component({
  selector: 'app-input-text-dwfe',
  templateUrl: './input-text.component.html'
})
export class InputTextDwfeComponent extends AbstractEditableControlDwfe implements OnInit {

  ngOnInit(): void {
    super.ngOnInit();

    this.control.valueChanges.pipe(takeUntil(this.latchForUnsubscribe))
      .subscribe((value: string) => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
          this.initValue = value;
          return;
        }
        let hasBeenChanged = value !== this.initValue;
        if (!this.initValue && value === '') {
          hasBeenChanged = false; // if init=null and has been changed to ''
        }
        this.setHasBeenChanged(hasBeenChanged);
      });
  }
}
