import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthtionService} from '@dwfe/modules/authtion/services/authtion.service';
import {AuthtionExchangeService} from '@dwfe/modules/authtion/services/authtion-exchange.service';
import {AbstractControl, FormGroup} from '@angular/forms';
import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';

@Component({
  selector: 'app-authtion-account-email',
  templateUrl: './account-email.component.html',
  styleUrls: ['./account-email.component.scss'],
})
export class AuthtionAccountEmailComponent extends AbstractExchangeableDwfe implements OnInit, AfterViewInit {

  private groupNewEmail = new FormGroup({});
  private controlNewEmail: AbstractControl;
  @ViewChild('refNewEmail', {read: ElementRef}) private refNewEmail: ElementRef;

  private groupCurrentPassword = new FormGroup({});
  private controlCurrentPassword: AbstractControl;
  @ViewChild('refCurrentPassword', {read: ElementRef}) private refCurrentPassword: ElementRef;

  constructor(private authtionService: AuthtionService,
              private exchangeService: AuthtionExchangeService) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.controlNewEmail = this.groupNewEmail.get('email');
    this.controlCurrentPassword = this.groupCurrentPassword.get('password');

    this.resetBackendError('controlNewEmail', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
    this.resetBackendError('controlCurrentPassword', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
  }
}
