import {Component, Input, OnInit} from '@angular/core';

import {AbstractEditableControlDwfe} from '@dwfe/classes/AbstractEditableControlDwfe';

@Component({
  selector: 'app-slide-toggle-dwfe',
  templateUrl: './slide-toggle.component.html',
})
export class SlideToggleDwfeComponent extends AbstractEditableControlDwfe implements OnInit {

  @Input() private position = 'above';
  @Input() private color = 'primary';

  ngOnInit(): void {
    super.ngOnInit(); // here it is just in case
  }

  private tooltipTxt(): string {
    return this.control.value ? this.labelText : 'not ' + this.labelText;
  }
}
