import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {MyErrorStateMatcherDwfe} from '@dwfe/classes/UtilsDwfe';

@Component({
  selector: 'app-input-text-dwfe',
  templateUrl: './input-text.component.html'
})
export class InputTextDwfeComponent implements OnInit {

  private group: FormGroup;
  @Output() private takeTextGroup = new EventEmitter<FormGroup>();
  private textControl: FormControl;

  @Input() private labelText = 'Just text field';

  @Input() private tabIndexValue = 0;

  private matcher = new MyErrorStateMatcherDwfe();

  ngOnInit(): void {
    this.textControl = new FormControl('', []);

    this.group = new FormGroup({
      'txt': this.textControl
    });

    this.takeTextGroup.emit(this.group);
  }
}
