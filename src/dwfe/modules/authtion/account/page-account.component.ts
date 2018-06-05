import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-authtion-page-account',
  templateUrl: './page-account.component.html',
  styleUrls: ['./page-account.component.scss']
})
export class AuthtionPageAccountComponent implements OnInit {

  navLinks: { label: string, path: string }[] = [
    {label: 'Payments', path: 'payments'},
    {label: 'Settings', path: 'settings'},
  ];

  constructor(protected router: Router) {
  }

  ngOnInit() {
    this.router.navigate(['account/settings']);
  }

}
