import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {AuthtionUtilsService} from '../../authtion-utils.service';
import {AuthtionExchangeService} from '../../authtion-exchange.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

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
  @ViewChild('refEmail') refEmail: ElementRef;

  group: FormGroup;
  @Output() takeEmailGroup = new EventEmitter<FormGroup>();

  @Input() reverseHandleResp: boolean;
  @Input() isDirtyTouchedCheckMode: boolean;
  errorMessage = '';

  @Input() tabIndexValue: number;

  isEmpty = AuthtionUtilsService.isEmpty;
  controlHasError = AuthtionUtilsService.controlHasError;
  getErrorOfControl = AuthtionUtilsService.getErrorOfControl;
  objToStr = AuthtionUtilsService.objToStr;

  constructor(private exchangeService: AuthtionExchangeService) {
  }

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

  /*
   * Don't send request to the backend on keyup. Only the last value for the interval.
   * Based on: https://github.com/angular/angular/issues/6895#issuecomment-329464982
   */
  backendValidator() {

    const observable = this.exchangeService.post_checkConsumerEmail(this.emailControl.value).retry(3);
    const debounceTime = 500; // ms

    if (this.reverseHandleResp) { // for 'Login'

      return Observable.timer(debounceTime).switchMapTo(observable).map(
        data => {
          if (data['success']) {
            return {'backend': 'Not found in our database'};
          } else {
            return null;
          }
        }).take(1);

    } else { // for 'Create account'

      return Observable.timer(debounceTime).switchMapTo(observable).map(
        data => {
          if (data['success']) {
            return null;
          } else {
            return {'backend': this.objToStr(data['details'])};
          }
        }).take(1);
    }

    // return this.reverseHandleResp ?
    //   new Promise(resolve => { // for 'Login'
    //     this.connect.pipe(retry(3)).subscribe(
    //       data => data['success'] ? resolve({'backend': 'Not found in our database'}) : resolve(null),
    //       error => resolve({'http': error.message})
    //     );
    //   })
    //   : new Promise(resolve => { // for 'Create account'
    //     this.connect.pipe(retry(3)).subscribe(
    //       data => {
    //         data['success'] ? resolve(null) : resolve({'backend': this.objToStr(data['details'])});
    //         this.emailControl.markAsTouched();
    //       },
    //       error => resolve({'http': error.message})
    //     );
    //   });
  }

  hasError(): boolean {
    if (this.controlHasError(this.emailControl, 'required', this.isDirtyTouchedCheckMode)) {
      this.errorMessage = 'Required';
      return true;
    } else if (this.controlHasError(this.emailControl, 'pattern', this.isDirtyTouchedCheckMode)) {
      this.errorMessage = 'Please enter a valid email';
      return true;
    } else if (this.controlHasError(this.emailControl, 'maxlength', this.isDirtyTouchedCheckMode)) {
      this.errorMessage = `Length must be <= ${this.maxLength}`;
      return true;
    } else if (this.controlHasError(this.emailControl, 'backend', this.isDirtyTouchedCheckMode)) {
      this.errorMessage = this.getErrorOfControl(this.emailControl, 'backend');
      return true;
    }

    this.errorMessage = '';
    return false;
  }

  clearEmail() {
    this.emailControl.setValue('');
    this.refEmail.nativeElement.focus();
  }
}
