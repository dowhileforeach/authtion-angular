import {Component, Input, OnInit} from '@angular/core';

import {takeUntil} from 'rxjs/operators';

import {AbstractEditableDwfe} from '@dwfe/classes/AbstractEditableDwfe';

@Component({
  selector: 'app-slide-toggle-dwfe',
  templateUrl: './slide-toggle.component.html',
})
export class SlideToggleDwfeComponent extends AbstractEditableDwfe implements OnInit {

  @Input() private position = 'above';
  @Input() private color = 'primary';

  ngOnInit(): void {
    super.ngOnInit();

    this.control.valueChanges.pipe(takeUntil(this.latchForUnsubscribe))
      .subscribe((value: boolean) => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
          this.initValue = value;
          return;
        }
        this.setHasBeenChanged(value !== this.initValue);
      });
  }

  private tooltipTxt(): string {
    return this.control.value ? this.labelText : 'not ' + this.labelText;
  }
}
