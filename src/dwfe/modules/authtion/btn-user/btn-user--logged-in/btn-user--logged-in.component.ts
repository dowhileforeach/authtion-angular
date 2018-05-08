import {Component} from '@angular/core';

import {AuthtionService} from '../../services/authtion.service';

@Component({
  selector: 'app-authtion-btn-user-logged-in',
  templateUrl: './btn-user--logged-in.component.html',
  styleUrls: ['./btn-user--logged-in.component.scss'],
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

