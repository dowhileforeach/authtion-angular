import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-page-account-settings',
  templateUrl: './page-account-settings.component.html',
  styleUrls: ['./page-account-settings.component.scss']
})
export class AuthtionPageAccountSettingsComponent implements OnInit {

  navLinks: { label: string, path: string }[] = [
    {label: 'Personal', path: 'personal'},
    {label: 'Email', path: 'email'},
    {label: 'Password', path: 'password'},
  ];

  constructor(protected router: Router) {
  }

  ngOnInit() {
    this.router.navigate(['account/settings/personal']);
  }

}
