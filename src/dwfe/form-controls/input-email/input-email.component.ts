import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import {UtilsDwfeService} from '../../services/utils.service';

@Component({
  selector: 'app-input-email-dwfe',
  templateUrl: './input-email.component.html',
  styleUrls: ['./input-email.component.scss']
})
export class InputEmailDwfeComponent implements OnInit {

  // http://emailregex.com/
  private PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @Input() private maxLength: number;

  private emailControl: FormControl;
  private emailControlID = UtilsDwfeService.randomStr('form-group-dwfe__email-'); // used in html template for a11y
  @ViewChild('refEmail') private refEmail: ElementRef;

  private group: FormGroup;
  @Output() private takeEmailGroup = new EventEmitter<FormGroup>();

  @Input() private reverseHandleRespFromBackend: boolean;
  @Input() private isDirtyTouchedCheckMode: boolean;
  private errorMessage = '';

  @Input() private tabIndexValue: number;

  @Input() private externalBackendValidator: any;

  private isEmpty = UtilsDwfeService.isEmpty; // used in html template
  private formControlHasError = UtilsDwfeService.formControlHasError;
  private getErrorOnFormControl = UtilsDwfeService.getErrorOnFormControl;

  ngOnInit() {

    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.pattern(this.PATTERN),
      Validators.maxLength(this.maxLength),
    ], [
      this.backendValidator.bind(this),
    ]);

    this.group = new FormGroup({
      'email': this.emailControl
    });

    this.takeEmailGroup.emit(this.group);
  }

  private backendValidator() {
    return this.externalBackendValidator ?
      this.externalBackendValidator(this.emailControl.value, this.reverseHandleRespFromBackend)
      : null;
  }

  private get hasError(): boolean {
    if (this.formControlHasError(this.emailControl, 'required', this.isDirtyTouchedCheckMode)) {
      this.errorMessage = 'Required';
      return true;
    } else if (this.formControlHasError(this.emailControl, 'pattern', this.isDirtyTouchedCheckMode)) {
      this.errorMessage = 'Please enter a valid email';
      return true;
    } else if (this.formControlHasError(this.emailControl, 'maxlength', this.isDirtyTouchedCheckMode)) {
      this.errorMessage = `Length must be <= ${this.maxLength}`;
      return true;
    } else if (this.formControlHasError(this.emailControl, 'backendHttp', this.isDirtyTouchedCheckMode)) {
      this.errorMessage = this.getErrorOnFormControl(this.emailControl, 'backendHttp');
      return true;
    }

    this.errorMessage = '';
    return false;
  }

  private clearEmail() {
    this.emailControl.setValue('');
    this.refEmail.nativeElement.focus();
  }
}
