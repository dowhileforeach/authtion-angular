import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

@Component({
  selector: 'app-input-password-dwfe',
  templateUrl: './input-password.component.html'
})
export class InputPasswordDwfeComponent implements OnInit {

  private minLength = 6;
  private maxLength = 55;

  private passwordControl: FormControl;
  private passwordControlID = UtilsDwfe.randomStr(5, 'dwfe-form-group__password-'); // used in html template for a11y
  @ViewChild('refPassword') private refPassword: ElementRef;

  @Input() private labelText = 'Password';

  private group: FormGroup;
  @Output() private takePasswordGroup = new EventEmitter<FormGroup>();

  private formControlHasError = UtilsDwfe.formControlHasError;
  private errorMessage = '';

  @Input() private tabIndexValue = 0;

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
    if (this.formControlHasError(this.passwordControl, 'required')) {
      this.errorMessage = 'Required';
      return true;
    } else if (this.formControlHasError(this.passwordControl, 'minlength')) {
      this.errorMessage = `Length must be >= ${this.minLength}`;
      return true;
    } else if (this.formControlHasError(this.passwordControl, 'maxlength')) {
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
