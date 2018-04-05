import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthtionUtilsService} from '../../authtion-utils.service';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import {_throw} from 'rxjs/observable/throw';
import {AuthtionExchangeService} from '../../authtion-exchange.service';

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
  @Input() tabIndexValue: number;
  @Input() reverseHandleResp: boolean;
  @Output() takeEmailGroup = new EventEmitter<FormGroup>();

  isEmpty = AuthtionUtilsService.isEmpty;
  controlHasError = AuthtionUtilsService.controlHasError;
  getErrorOfControl = AuthtionUtilsService.getErrorOfControl;
  objToStr = AuthtionUtilsService.objToStr;

  errorMessage = '';

  constructor(private http: HttpClient, private exchServ: AuthtionExchangeService) {
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

  backendValidator() {

    return this.reverseHandleResp ?
      new Promise(resolve => {
        this.exchServ.post_checkConsumerEmail(this.emailControl.value)
          .catch(error => _throw(
            resolve({'http': error.message})
          ))
          .subscribe(answer =>
            answer['success'] ?
              resolve({'backend': 'Not found in our database'})
              : resolve(null)
          );
      })
      : new Promise(resolve => {
        this.exchServ.post_checkConsumerEmail(this.emailControl.value)
          .catch(error => _throw(
            resolve({'http': error.message})
          ))
          .subscribe(answer =>
            answer['success'] ?
              resolve(null)
              : resolve({'backend': this.objToStr(answer.details)})
          );
      });
  }

  hasError(): boolean {
    if (this.controlHasError(this.emailControl, 'required')) {
      this.errorMessage = 'Required';
      return true;
    } else if (this.controlHasError(this.emailControl, 'pattern')) {
      this.errorMessage = 'Please enter a valid email';
      return true;
    } else if (this.controlHasError(this.emailControl, 'maxlength')) {
      this.errorMessage = `Length must be <= ${this.maxLength}`;
      return true;
    } else if (this.controlHasError(this.emailControl, 'http')) {
      this.errorMessage = this.getErrorOfControl(this.emailControl, 'http');
      return true;
    } else if (this.controlHasError(this.emailControl, 'backend')) {
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