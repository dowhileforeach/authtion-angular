import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-select-dwfe',
  templateUrl: './select.component.html'
})
export class SelectDwfeComponent implements OnInit {

  @Input() private selectedValue: string;
  @Input() private appearanceValue = ''; // 'fill', 'standard', 'outline', and ''
  @Input() private labelText = '';
  @Input() private items: { value: string, viewValue: string }[];

  @Output() private takeValue = new EventEmitter<string>();

  @Input() private markIfChanged = false;
  private initValue: string;
  private hasBeenChanged = false;
  @Output() private takeHasBeenChanged = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.initValue = this.selectedValue;
  }

  private valueChange(): void {
    setTimeout(() => {
      this.takeValue.emit(this.selectedValue);
      this.hasBeenChanged = this.selectedValue !== this.initValue;
    }, 10);
  }
}
