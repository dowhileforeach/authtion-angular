import {Component} from '@angular/core';

import {AuthtionService} from '../services/authtion.service';

@Component({
  selector: 'app-authtion-btn-user',
  template: `
    <app-authtion-btn-user-logged-in *ngIf="(authtionService.isLoggedIn$ | async)"></app-authtion-btn-user-logged-in>
    <app-authtion-btn-user-not-authenticated *ngIf="!(authtionService.isLoggedIn$ | async)"></app-authtion-btn-user-not-authenticated>
  `
})
export class AuthtionBtnUserComponent {
  constructor(protected authtionService: AuthtionService) {
  }
}
