import {Component, OnDestroy} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-page-authtion-login-register',
  templateUrl: './page-authtion__login-register.component.html',
  styleUrls: ['./page-authtion__login-register.component.scss']
})
export class PageAuthtionLoginRegisterComponent implements OnDestroy {

  isLoginSlide = true;

  gLoginEmail = new FormGroup({});
  gLoginPassword = new FormGroup({});
  gCreateAccountEmail = new FormGroup({});
  exchangeEmailSubscription: Subscription;

  changeSlide() {
    this.isLoginSlide = !this.isLoginSlide;
    this.exchangeEmail();
  }

  exchangeEmail() {
    const loginEmail = this.gLoginEmail.get('email');
    const createAccountEmail = this.gCreateAccountEmail.get('email');

    if (this.exchangeEmailSubscription) {
      this.exchangeEmailSubscription.unsubscribe();
    }

    this.isLoginSlide ?
      this.exchangeEmailSubscriber(loginEmail, createAccountEmail)
      : this.exchangeEmailSubscriber(createAccountEmail, loginEmail);
  }

  exchangeEmailSubscriber(subject: AbstractControl, observer: AbstractControl) {
    if (subject && observer) {
      this.exchangeEmailSubscription = subject.valueChanges.subscribe(value => {
        observer.setValue(value ? value : '');
      });
    }
  }

  // http://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  ngOnDestroy(): void {
    this.exchangeEmailSubscription.unsubscribe();
  }
}








