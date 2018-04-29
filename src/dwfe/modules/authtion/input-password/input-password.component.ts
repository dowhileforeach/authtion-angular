import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {AuthtionUtilsService} from '../services/authtion-utils.service';

@Component({
  selector: 'app-authtion-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss']
})
export class AuthtionInputPasswordComponent implements OnInit {

  private minLength = 6;
  private maxLength = 55;

  private passwordControl: FormControl;
  private passwordControlID = AuthtionUtilsService.randomStr('form-group-authtion__password-'); // for a11y
  @ViewChild('refPassword') private refPassword: ElementRef;

  private group: FormGroup;
  @Output() private takePasswordGroup = new EventEmitter<FormGroup>();

  private controlHasError = AuthtionUtilsService.controlHasError;
  private errorMessage = '';

  ngOnInit() {

    this.passwordControl = new FormControl('', [
      Validators.required,
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength),
    ]);

    this.group = new FormGroup({
      'password': this.passwordControl
    });

    this.takePasswordGroup.emit(this.group);
  }

  private get hasError(): boolean {
    if (this.controlHasError(this.passwordControl, 'required')) {
      this.errorMessage = 'Required';
      return true;
    } else if (this.controlHasError(this.passwordControl, 'minlength')) {
      this.errorMessage = `Length must be >= ${this.minLength}`;
      return true;
    } else if (this.controlHasError(this.passwordControl, 'maxlength')) {
      this.errorMessage = `Length must be <= ${this.maxLength}`;
      return true;
    }
    this.errorMessage = '';
    return false;
  }

  private clearPassword() {
    this.passwordControl.setValue('');
    this.refPassword.nativeElement.focus();
  }
}
