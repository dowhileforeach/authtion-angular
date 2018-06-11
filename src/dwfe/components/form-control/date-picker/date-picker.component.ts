import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-date-picker-dwfe',
  templateUrl: './date-picker.component.html'
})
export class DatePickerDwfeComponent implements OnInit {

  private group: FormGroup;
  @Output() private takeDateGroup = new EventEmitter<FormGroup>();
  private controlDate: FormControl;

  @Input() private labelText = 'Choose a date';

  @Input() private inputDisabled = true;

  ngOnInit(): void {
    this.controlDate = new FormControl();
    if (this.inputDisabled) {
      this.controlDate.disable();
    }

    this.group = new FormGroup({
      'date': this.controlDate
    });

    this.takeDateGroup.emit(this.group);
  }
}
