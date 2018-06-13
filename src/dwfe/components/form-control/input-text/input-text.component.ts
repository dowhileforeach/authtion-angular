import {Component, OnInit} from '@angular/core';

import {AbstractEditableControlDwfe} from '@dwfe/classes/AbstractEditableControlDwfe';

@Component({
  selector: 'app-input-text-dwfe',
  templateUrl: './input-text.component.html'
})
export class InputTextDwfeComponent extends AbstractEditableControlDwfe implements OnInit {

  protected compareAs = 'textField';

  ngOnInit(): void {
    super.ngOnInit(); // here it is just in case
  }
}
