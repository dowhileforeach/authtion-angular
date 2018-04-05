import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthtionUtilsService} from '../../authtion-utils.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import {_throw} from 'rxjs/observable/throw';

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
  @Output() takeEmailGroup = new EventEmitter<FormGroup>();
  isEmpty = AuthtionUtilsService.isEmpty;
  controlHasError = AuthtionUtilsService.controlHasError;
  getErrorOfControl = AuthtionUtilsService.getErrorOfControl;
  errorMessage = '';

  constructor(private http: HttpClient) {
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
    const body = `{"email": "${this.emailControl.value}"}`;

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json; charset=utf-8');

    return new Promise(resolve => {

      this.http.post('http://localhost:8080/v1/check-consumer-email', body, {headers})

        .catch(error => _throw(
          resolve({'http': error.message})
        ))

        .subscribe(result => {
            if (result['success']) {
              resolve(null);
            } else {
              let message = '';
              for (const prop of Object.keys(result.details)) {
                message += `${prop} ${result.details[prop]}\n`;
              }
              resolve({
                'backend': message
              });
            }
          }
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
