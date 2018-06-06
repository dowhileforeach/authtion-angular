import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';

import {AuthtionService} from '../../services/authtion.service';

@Component({
  selector: 'app-authtion-btn-user-logged-in',
  templateUrl: './btn-user--logged-in.component.html',
  styleUrls: ['./btn-user--logged-in.component.scss'],
  animations: [
    trigger('animateShowBlock', [ // https://angular.io/guide/animations#example-entering-and-leaving
      transition(':enter', [      // https://angular.io/api/animations/transition#using-enter-and-leave
        style({opacity: 0}),
        animate('120ms ease-in', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('120ms ease-out', style({opacity: 0}))
        // animate('150ms ease-out', style({opacity: 0, transform: 'translateX(100%)'}))
      ]),
    ])
  ],
})
export class AuthtionBtnUserLoggedInComponent {

  private isMenuOpen = false;
  private user = this.authtionService.user;

  constructor(protected authtionService: AuthtionService,
              protected router: Router) {
  }

  private myAccount(): void {
    this.router.navigate(['account/settings/personal']);
    this.isMenuOpen = false;
  }

  private logout(): void {
    this.authtionService.logout();
  }
}

