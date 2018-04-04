import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthtionUtilsService} from '../../authtion-utils.service';

@Component({
  selector: 'app-input-authtion-email',
  templateUrl: './input-authtion__email.component.html',
})
export class InputAuthtionEmailComponent implements OnInit {

  // http://emailregex.com/
  PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  maxLength = 50;

  emailControl: FormControl;
  emailControlID = AuthtionUtilsService.randomStr('form-group-authtion__email-'); // for a11y
  group: FormGroup;
  @Output() takeEmailGroup = new EventEmitter<FormGroup>();
  isEmpty = AuthtionUtilsService.isEmpty;
  controlHasError = AuthtionUtilsService.controlHasError;

  ngOnInit() {

    this.emailControl = new FormControl('', [
      Validators.required,
      this.regexpValidator.bind(this),
      this.lengthValidator.bind(this),
    ]);

    this.group = new FormGroup({
      'email': this.emailControl
    });

    this.takeEmailGroup.emit(this.group);
  }

  regexpValidator(control: FormControl) {
    if (!this.PATTERN.test(control.value)) {
      return {
        'isNotEmail': true
      };
    }
    return null;
  }

  lengthValidator(control: FormControl) {
    if (control.value.length > this.maxLength) {
      return {
        'emailLength': true
      };
    }
    return null;
  }
}
