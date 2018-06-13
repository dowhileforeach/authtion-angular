import {Component, Input, OnInit} from '@angular/core';

import {takeUntil} from 'rxjs/operators';

import {AbstractEditableControlDwfe} from '@dwfe/classes/AbstractEditableControlDwfe';

@Component({
  selector: 'app-select-dwfe',
  templateUrl: './select.component.html'
})
export class SelectDwfeComponent extends AbstractEditableControlDwfe implements OnInit {

  @Input() private items: { value: string, viewValue: string }[];

  ngOnInit(): void {
    super.ngOnInit();

    this.control.valueChanges.pipe(takeUntil(this.latchForUnsubscribe))
      .subscribe((value: string) => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
          this.initValue = value;
          return;
        }
        this.setHasBeenChanged(value !== this.initValue);
      });
  }
}
