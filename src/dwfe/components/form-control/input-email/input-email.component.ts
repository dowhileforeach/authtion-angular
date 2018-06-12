import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {MyErrorStateMatcherDwfe} from '@dwfe/classes/UtilsDwfe';

@Component({
  selector: 'app-input-email-dwfe',
  templateUrl: './input-email.component.html'
})
export class InputEmailDwfeComponent implements OnInit {

  // http://emailregex.com/
  private PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @Input() private maxLength = 50;

  private group: FormGroup;
  private control: FormControl;
  @Output() private takeGroup = new EventEmitter<FormGroup>();

  @Input() private appearanceValue = 'fill'; // 'fill', 'standard', 'outline', and ''
  @Input() private labelText = 'Email';
  @Input() private hintText = '';

  @Input() private reverseHandleRespFromBackend = false;

  @Input() private tabIndexValue = 0;

  @Input() private externalBackendValidator = null;

  private matcher = new MyErrorStateMatcherDwfe();

  ngOnInit() {

    this.control = new FormControl('', [
      Validators.required,
      Validators.pattern(this.PATTERN),
      Validators.maxLength(this.maxLength),
    ], [
      this.backendValidator.bind(this),
    ]);

    this.group = new FormGroup({
      'email': this.control
    });

    this.takeGroup.emit(this.group);
  }

  private backendValidator() {
    return this.externalBackendValidator ?
      this.externalBackendValidator(this.control.value, this.reverseHandleRespFromBackend)
      : null;
  }
}
