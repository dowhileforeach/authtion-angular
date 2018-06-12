import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractEditableDwfe} from '@dwfe/classes/AbstractEditableDwfe';

@Component({
  selector: 'app-slide-toggle-dwfe',
  templateUrl: './slide-toggle.component.html',
})
export class SlideToggleDwfeComponent extends AbstractEditableDwfe implements OnInit {

  @Input() private currentValue: boolean;
  @Input() private position = 'above';
  @Input() private color = 'primary';
  @Input() private tooltipText = 'public';

  @Output() private takeValue = new EventEmitter<boolean>();

  ngOnInit(): void {
    super.ngOnInit();
    this.takeValue.emit(this.currentValue);
    this.initValue = this.currentValue;
  }

  private tooltipTxt(): string {
    return this.currentValue ? this.tooltipText : 'not ' + this.tooltipText;
  }

  private onChange() {
    setTimeout(() => {
      this.takeValue.emit(this.currentValue);
      this.setHasBeenChanged(this.currentValue !== this.initValue);
    }, 10); // https://stackoverflow.com/questions/42793095/angular2-md-slide-toggle-displays-the-wrong-value#42794060
  }

  private setHasBeenChanged(value): void {
    this.hasBeenChanged = value;
    this.takeHasBeenChanged.emit(value);
  }

  cancel(value): void {
    if (value) {
      this.currentValue = this.initValue;
      this.setHasBeenChanged(false);
    }
  }
}
