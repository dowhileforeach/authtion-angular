import {Component, OnInit} from '@angular/core';

import {AbstractEditableControlDwfe} from '@dwfe/classes/AbstractEditableControlDwfe';

@Component({
  selector: 'app-date-picker-dwfe',
  templateUrl: './date-picker.component.html'
})
export class DatePickerDwfeComponent extends AbstractEditableControlDwfe implements OnInit {

  protected compareAs = 'dateField';

  ngOnInit(): void {
    super.ngOnInit(); // here it is just in case
  }
}
