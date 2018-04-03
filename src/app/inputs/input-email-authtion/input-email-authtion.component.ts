import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../utils.service';

@Component({
  selector: 'app-input-email-authtion',
  templateUrl: './input-email-authtion.component.html',
  styleUrls: ['./input-email-authtion.component.scss']
})
export class InputEmailAuthtionComponent implements OnInit {

  group: FormGroup;
  @Output() takeEmailGroup = new EventEmitter<FormGroup>();

  // http://emailregex.com/
  EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  emailMaxLength = 50;

  constructor(public utl: UtilsService) {
  }

  ngOnInit() {

    this.group = new FormGroup({
      'email': new FormControl('', [
        Validators.required,
        this.emailRegexpValidator.bind(this),
        this.emailLengthValidator.bind(this),
      ])
    });

    this.takeEmailGroup.emit(this.group);
  }

  emailRegexpValidator(control: FormControl) {
    if (!this.EMAIL_PATTERN.test(control.value)) {
      return {
        'isNotEmail': true
      };
    }
    return null;
  }

  emailLengthValidator(control: FormControl) {
    const emailLength = control.value.length;
    if (emailLength > this.emailMaxLength) {
      return {
        'emailLength': true
      };
    }
    return null;
  }
}
