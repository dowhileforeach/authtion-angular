import {Component, Input, OnInit} from '@angular/core';

import {AbstractEditableControlDwfe} from '@dwfe/classes/AbstractEditableControlDwfe';

@Component({
  selector: 'app-select-dwfe',
  templateUrl: './select.component.html'
})
export class SelectDwfeComponent extends AbstractEditableControlDwfe implements OnInit {

  @Input() private items: { value: string, viewValue: string }[];

  ngOnInit(): void {
    super.ngOnInit(); // here it is just in case
  }
}
