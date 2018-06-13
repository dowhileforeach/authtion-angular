import {Component, Input, OnInit} from '@angular/core';
import {AbstractEditableDwfe} from '@dwfe/classes/AbstractEditableDwfe';
import {FormControl, FormGroup} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-select-dwfe',
  templateUrl: './select.component.html'
})
export class SelectDwfeComponent extends AbstractEditableDwfe implements OnInit {

  @Input() private appearanceValue = 'fill'; // 'fill', 'standard', 'outline', and ''
  @Input() private labelText = '';
  @Input() private items: { value: string, viewValue: string }[];

  ngOnInit(): void {
    super.ngOnInit();

    this.group = new FormGroup({
      'select': new FormControl()
    });
    this.control = this.group.get('select');

    this.control.valueChanges.pipe(takeUntil(this.latchForUnsubscribe))
      .subscribe((value: string) => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
          this.initValue = value;
          return;
        }
        this.setHasBeenChanged(value !== this.initValue);
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
