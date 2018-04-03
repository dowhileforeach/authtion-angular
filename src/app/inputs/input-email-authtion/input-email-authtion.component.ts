import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../utils.service';

@Component({
  selector: 'app-input-email-authtion',
  templateUrl: './input-email-authtion.component.html',
  styles: ['']
})
export class InputEmailAuthtionComponent implements OnInit {

  @Output() takeEmailGroup = new EventEmitter<FormGroup>();
  group: FormGroup;
  // http://emailregex.com/
  PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  maxLength = 50;
  isEmpty = UtilsService.isEmpty;
  isWrongControl = UtilsService.isWrongControl;

  ngOnInit() {

    this.group = new FormGroup({
      'email': new FormControl('', [
        Validators.required,
        this.regexpValidator.bind(this),
        this.lengthValidator.bind(this),
      ])
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
