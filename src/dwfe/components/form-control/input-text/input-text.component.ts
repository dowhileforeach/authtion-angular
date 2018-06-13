import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

import {MyErrorStateMatcherDwfe} from '@dwfe/classes/UtilsDwfe';
import {AbstractEditableDwfe} from '@dwfe/classes/AbstractEditableDwfe';

@Component({
  selector: 'app-input-text-dwfe',
  templateUrl: './input-text.component.html'
})
export class InputTextDwfeComponent extends AbstractEditableDwfe implements OnInit {

  private group: FormGroup;
  private control: FormControl;
  @Output() private takeGroup = new EventEmitter<FormGroup>();

  @Input() private appearanceValue = 'fill'; // 'fill', 'standard', 'outline', and ''
  @Input() private labelText = 'Just text field';

  private matcher = new MyErrorStateMatcherDwfe();

  ngOnInit(): void {
    super.ngOnInit();

    this.control = new FormControl('', []);
    this.group = new FormGroup({
      'txt': this.control
    });
    this.control.valueChanges.pipe(takeUntil(this.latchForUnsubscribe))
      .subscribe(value => {
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
    this.takeGroup.emit(this.group);
  }

  cancel(value): void {
    if (value) {
      this.control.setValue(this.initValue);
    }
  }
}
