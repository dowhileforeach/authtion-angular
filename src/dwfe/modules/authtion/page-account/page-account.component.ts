import { Component, OnInit } from '@angular/core';
import {AuthtionPageLoginRegisterComponent} from '@dwfe/modules/authtion/page-login-register/page-login-register.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-authtion-page-account',
  templateUrl: './page-account.component.html',
  styleUrls: ['./page-account.component.scss']
})
export class AuthtionPageAccountComponent implements OnInit {

  navLinks: {label: string, path: string}[] = [
    {label: 'Settings', path: 'settings'},
    {label: 'Orders', path: 'orders'},
  ];

  constructor(protected router: Router) { }

  ngOnInit() {
    this.router.navigate(['account/settings']);
  }

}
