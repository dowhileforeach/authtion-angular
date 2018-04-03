import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../utils.service';

@Component({
  selector: 'app-input-password-authtion',
  templateUrl: './input-password-authtion.component.html',
  styleUrls: ['./input-password-authtion.component.scss']
})
export class InputPasswordAuthtionComponent implements OnInit {

  group: FormGroup;
  @Output() takePasswordGroup = new EventEmitter<FormGroup>();

  passwordMinLength = 6;
  passwordMaxLength = 55;

  constructor(public utl: UtilsService) {
  }

  ngOnInit() {

    this.group = new FormGroup({
      'password': new FormControl('', [
        Validators.required,
        this.passwordLengthValidator.bind(this),
      ])
    });

    this.takePasswordGroup.emit(this.group);
  }

  passwordLengthValidator(control: FormControl) {
    const passwordLength = control.value.length;
    if (passwordLength < this.passwordMinLength || passwordLength > this.passwordMaxLength) {
      return {
        'passwordLength': true
      };
    }
    return null;
  }

}
