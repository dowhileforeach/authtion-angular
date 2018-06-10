import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-slide-toggle-dwfe',
  templateUrl: './slide-toggle.component.html',
})
export class SlideToggleDwfeComponent implements OnInit {

  @Input() private currentValue: boolean;
  @Input() private position = 'above';
  @Input() private color = 'primary';
  @Input() private tooltipText = 'public';

  @Output() private takeValue = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.takeValue.emit(this.currentValue);
  }

  private tooltipTxt(): string {
    return this.currentValue ? this.tooltipText : 'not ' + this.tooltipText;
  }

  private onClick(): void {
    setTimeout(() =>
        this.takeValue.emit(this.currentValue)
      , 10); // https://stackoverflow.com/questions/42793095/angular2-md-slide-toggle-displays-the-wrong-value#42794060
  }
}
