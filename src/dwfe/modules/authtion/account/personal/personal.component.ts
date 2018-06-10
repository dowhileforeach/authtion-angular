import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {AbstractExchangeableDwfe} from '@dwfe/classes/AbstractExchangeableDwfe';
import {AuthtionService} from '@dwfe/modules/authtion/services/authtion.service';

@Component({
  selector: 'app-authtion-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class AuthtionPersonalComponent extends AbstractExchangeableDwfe implements OnInit, AfterViewInit {

  private gEmail: FormGroup;
  private groupEmail = new FormGroup({});
  private controlEmail: AbstractControl;
  private isEmailPublic: boolean;

  constructor(private authtionService: AuthtionService) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.controlEmail = this.groupEmail.get('txt');
      this.controlEmail.setValue(this.authtionService.user.email);
      this.controlEmail.disable();
      this.isEmailPublic = !this.authtionService.user.emailNonPublic;

      this.resetBackendError('controlEmail', ['errorMessage', 'successMessage'], this.latchForUnsubscribe);
    }, 10);
  }

  private tTxt(isPublic: boolean): string {
    return isPublic ? 'public' : 'not public';
  }
}
