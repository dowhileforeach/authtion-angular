import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-select-dwfe',
  templateUrl: './select.component.html'
})
export class SelectDwfeComponent {

  @Input() private selectedValue: string;
  @Input() private labelText = '';
  @Input() private items: { value: string, viewValue: string }[];

  @Output() private takeValue = new EventEmitter<string>();

  private onSelect(): void {
    this.takeValue.emit(this.selectedValue);
  }
}
