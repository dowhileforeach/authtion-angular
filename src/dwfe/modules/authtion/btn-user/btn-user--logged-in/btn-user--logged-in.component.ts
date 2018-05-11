import {Component} from '@angular/core';

import {AuthtionService} from '../../services/authtion.service';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-authtion-btn-user-logged-in',
  templateUrl: './btn-user--logged-in.component.html',
  styleUrls: ['./btn-user--logged-in.component.scss'],
  animations: [
    trigger('animateShowBlock', [ // https://angular.io/guide/animations#example-entering-and-leaving
      transition(':enter', [      // https://angular.io/api/animations/transition#using-enter-and-leave
        style({opacity: 0}),
        animate('175ms ease-in', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('150ms ease-out', style({opacity: 0, transform: 'translateX(100%)'}))
      ]),
    ])
  ],
})
export class AuthtionBtnUserLoggedInComponent {

  private isMenuOpen = false;
  private user = this.authtionService.user;

  constructor(private authtionService: AuthtionService) {
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  myAccount(): void {
  }

  logout(): void {
    this.authtionService.logout();
  }
}

