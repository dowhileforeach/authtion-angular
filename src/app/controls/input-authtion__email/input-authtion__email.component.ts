import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import {AuthtionExchangeService} from '../../authtion-exchange.service';
import {AuthtionUtilsService} from '../../authtion-utils.service';

@Component({
  selector: 'app-input-authtion-email',
  templateUrl: './input-authtion__email.component.html',
  styleUrls: ['./input-authtion__email.component.scss']
})
export class InputAuthtionEmailComponent implements OnInit {

  // http://emailregex.com/
  private PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private maxLength = 50;

  private emailControl: FormControl;
  private emailControlID = AuthtionUtilsService.randomStr('form-group-authtion__email-'); // for a11y
  @ViewChild('refEmail') private refEmail: ElementRef;

  private group: FormGroup;
  @Output() private takeEmailGroup = new EventEmitter<FormGroup>();

  @Input() private reverseHandleResp: boolean;
  @Input() private isDirtyTouchedCheckMode: boolean;
  private errorMessage = '';

  @Input() private tabIndexValue: number;

  private isEmpty = AuthtionUtilsService.isEmpty;
  private controlHasError = AuthtionUtilsService.controlHasError;
  private getErrorOfControl = AuthtionUtilsService.getErrorOfControl;
  private objToStr = AuthtionUtilsService.objToStr;

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
  private backendValidator() {
    const observable = this.exchangeService.post_checkConsumerEmail(this.emailControl.value).retry(3);
    const debounceTime = 500; // ms

    if (this.reverseHandleResp) { // for 'Login'

      return Observable.timer(debounceTime).switchMapTo(observable).map(
        data => {
          if (data['success']) {
            return {'backend': 'Not found in our database'};
          } else if (data['details']['email'] !== 'is already present in our database') {
            return {'backend': this.objToStr(data['details'])};
          }
          return null;
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

  private get hasError(): boolean {
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

  private clearEmail() {
    this.emailControl.setValue('');
    this.refEmail.nativeElement.focus();
  }
}
