import {Component, Input, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';

import {MyErrorStateMatcherDwfe} from '@dwfe/classes/UtilsDwfe';
import {AbstractEditableControlDwfe} from '@dwfe/classes/AbstractEditableControlDwfe';

@Component({
  selector: 'app-input-email-dwfe',
  templateUrl: './input-email.component.html'
})
export class InputEmailDwfeComponent extends AbstractEditableControlDwfe implements OnInit {

  // http://emailregex.com/
  private PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @Input() private maxLength = 50;

  @Input() private reverseHandleRespFromBackend = false;

  @Input() private externalBackendValidator = null;

  protected validators = [
    Validators.required,
    Validators.pattern(this.PATTERN),
    Validators.maxLength(this.maxLength),
  ];

  protected asyncValidators = [
    this.backendValidator.bind(this),
  ];

  protected compareAs = 'textField';

  private matcher = new MyErrorStateMatcherDwfe();

  ngOnInit(): void {
    super.ngOnInit(); // here it is just in case
  }

  private backendValidator() {
    return this.externalBackendValidator ?
      this.externalBackendValidator(this.control.value, this.reverseHandleRespFromBackend)
      : null;
  }
}
