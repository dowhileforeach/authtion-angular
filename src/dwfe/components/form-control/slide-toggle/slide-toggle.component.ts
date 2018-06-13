import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractEditableDwfe} from '@dwfe/classes/AbstractEditableDwfe';

@Component({
  selector: 'app-slide-toggle-dwfe',
  templateUrl: './slide-toggle.component.html',
})
export class SlideToggleDwfeComponent extends AbstractEditableDwfe implements OnInit {

  @Input() private position = 'above';
  @Input() private color = 'primary';
  @Input() private tooltipText = 'public';

  @Output() private takeValue = new EventEmitter<boolean>();

  ngOnInit(): void {
    super.ngOnInit();
    this.currValue = this.initValue;
    this.takeValue.emit(this.initValue);
  }

  private tooltipTxt(): string {
    return this.currValue ? this.tooltipText : 'not ' + this.tooltipText;
  }

  private onChange() {
    setTimeout(() => {
      this.takeValue.emit(this.currValue);
      this.setHasBeenChanged(this.currValue !== this.initValue);
    }, 10); // https://stackoverflow.com/questions/42793095/angular2-md-slide-toggle-displays-the-wrong-value#42794060
  }

  cancel(value): void {
    if (value) {
      this.currValue = this.initValue;
      this.setHasBeenChanged(false);
    }
  }
}
