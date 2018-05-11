import {Component} from '@angular/core';

import {AuthtionService} from '../../services/authtion.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-authtion-btn-user-logged-in',
  templateUrl: './btn-user--logged-in.component.html',
  styleUrls: ['./btn-user--logged-in.component.scss'],
  animations: [
    trigger('animateShowBlock', [
      state('close', style({
        opacity: 0
      })),
      state('open', style({
        opacity: 1
      })),
      transition('close <=> open', animate(2000)),
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

