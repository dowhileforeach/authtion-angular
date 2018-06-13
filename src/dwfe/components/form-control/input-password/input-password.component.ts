import {Component, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';

import {MyErrorStateMatcherDwfe} from '@dwfe/classes/UtilsDwfe';
import {AbstractEditableControlDwfe} from '@dwfe/classes/AbstractEditableControlDwfe';

@Component({
  selector: 'app-input-password-dwfe',
  templateUrl: './input-password.component.html'
})
export class InputPasswordDwfeComponent extends AbstractEditableControlDwfe implements OnInit {

  private minLength = 6;
  private maxLength = 55;

  protected validators = [
    Validators.required,
    Validators.minLength(this.minLength),
    Validators.maxLength(this.maxLength),
  ];

  private hideCharacters = true;

  private matcher = new MyErrorStateMatcherDwfe();

  ngOnInit(): void {
    super.ngOnInit();
  }

  private switchHide(): void {
    this.hideCharacters = !this.hideCharacters;
  }
}
