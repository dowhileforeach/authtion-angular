import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthtionUtilsService} from '../../authtion-utils.service';

@Component({
  selector: 'app-input-authtion-password',
  templateUrl: './input-authtion__password.component.html',
  styles: ['']
})
export class InputAuthtionPasswordComponent implements OnInit {

  minLength = 6;
  maxLength = 55;

  passwordControl: FormControl;
  passwordControlID = AuthtionUtilsService.randomStr('form-group-authtion__password-'); // for a11y
  group: FormGroup;
  @Output() takePasswordGroup = new EventEmitter<FormGroup>();
  controlHasError = AuthtionUtilsService.controlHasError;

  ngOnInit() {

    this.passwordControl = new FormControl('', [
      Validators.required,
      this.lengthValidator.bind(this),
    ]);

    this.group = new FormGroup({
      'password': this.passwordControl
    });

    this.takePasswordGroup.emit(this.group);
  }

  lengthValidator(control: FormControl) {
    const length = control.value.length;
    if (length < this.minLength || length > this.maxLength) {
      return {
        'passwordLength': true
      };
    }
    return null;
  }

}
