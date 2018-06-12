import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractEditableDwfe} from '@dwfe/classes/AbstractEditableDwfe';

@Component({
  selector: 'app-select-dwfe',
  templateUrl: './select.component.html'
})
export class SelectDwfeComponent extends AbstractEditableDwfe implements OnInit {

  @Input() private selectedValue: string;
  @Input() private appearanceValue = 'fill'; // 'fill', 'standard', 'outline', and ''
  @Input() private labelText = '';
  @Input() private items: { value: string, viewValue: string }[];

  @Output() private takeValue = new EventEmitter<string>();

  ngOnInit(): void {
    super.ngOnInit();
    this.initValue = this.selectedValue;
  }

  private onValueChange(): void {
    setTimeout(() => {
      this.takeValue.emit(this.selectedValue);
      this.setHasBeenChanged(this.selectedValue !== this.initValue);
    }, 10);
  }

  private setHasBeenChanged(value): void {
    this.hasBeenChanged = value;
    this.takeHasBeenChanged.emit(value);
  }

  cancel(value): void {
    if (value) {
      this.selectedValue = this.initValue;
      this.setHasBeenChanged(false);
    }
  }
}
