import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';

@Component({
  selector: 'app-authtion-account-password',
  templateUrl: './page-account-password.component.html',
  styleUrls: ['./page-account-password.component.scss'],
})
export class AuthtionAccountPasswordComponent  extends AbstractExchangeableDwfe implements OnInit, AfterViewInit {

  private groupNewPassword = new FormGroup({});
  private controlNewPassword: AbstractControl;
  @ViewChild('refNewPassword', {read: ElementRef}) private refNewPassword: ElementRef;

  private groupRepeatNewPassword = new FormGroup({});
  private controlRepeatNewPassword: AbstractControl;
  @ViewChild('refRepeatNewPassword', {read: ElementRef}) private refRepeatNewPassword: ElementRef;

  private groupCurrentPassword = new FormGroup({});
  private controlCurrentPassword: AbstractControl;
  @ViewChild('refCurrentPassword', {read: ElementRef}) private refCurrentPassword: ElementRef;

  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.controlNewPassword = this.groupNewPassword.get('password');
    this.controlRepeatNewPassword = this.groupRepeatNewPassword.get('password');
    this.controlCurrentPassword = this.groupCurrentPassword.get('password');
  }

  private performChangePassword(): void {

  }


}
