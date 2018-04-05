import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthtionUtilsService} from '../../authtion-utils.service';

@Component({
  selector: 'app-input-authtion-password',
  templateUrl: './input-authtion__password.component.html',
})
export class InputAuthtionPasswordComponent implements OnInit {

  minLength = 6;
  maxLength = 55;

  passwordControl: FormControl;
  passwordControlID = AuthtionUtilsService.randomStr('form-group-authtion__password-'); // for a11y
  @ViewChild('refPassword') refPassword: ElementRef;
  group: FormGroup;
  @Output() takePasswordGroup = new EventEmitter<FormGroup>();
  controlHasError = AuthtionUtilsService.controlHasError;
  errorMessage = '';

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

  hasError(): boolean {
    if (this.controlHasError(this.passwordControl, 'required')) {
      this.errorMessage = 'Required';
      return true;
    } else if (this.controlHasError(this.passwordControl, 'passwordLength')) {
      this.errorMessage = `Length must be >= ${this.minLength} and <= ${this.maxLength}`;
      return true;
    }
    this.errorMessage = '';
    return false;
  }

  clearPassword() {
    this.passwordControl.setValue('');
    this.refPassword.nativeElement.focus();
  }
}
