import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-authtion-account',
  template: `
    <section class="authtion-account">
      <h1 class="visually-hidden">Account page</h1>

      <nav mat-tab-nav-bar>
        <a mat-tab-link
           *ngFor="let link of navLinks"
           [routerLink]="link.path"
           routerLinkActive #rla="routerLinkActive"
           [active]="rla.isActive">
          {{link.label}}
        </a>
      </nav>

      <router-outlet></router-outlet>

    </section>
  `
})
export class AuthtionAccountComponent implements OnInit {

  private navLinks: { path: string, label: string }[] = [
    {path: 'payments', label: 'Payments'}, // AuthtionPaymentsComponent
    {path: 'profile', label: 'Profile'},   // AuthtionProfileComponent
    {path: 'settings', label: 'Settings'}, // AuthtionSettingsComponent
  ];

  constructor() {
  }

  ngOnInit() {
  }
}
