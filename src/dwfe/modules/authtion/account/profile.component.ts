import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-authtion-profile',
  template: `
    <section class="authtion-profile">
      <h1 class="visually-hidden">Profile page</h1>

      <nav mat-tab-nav-bar>
        <a mat-tab-link
           *ngFor="let link of navLinks"
           [routerLink]="link.path"
           routerLinkActive
           #rla="routerLinkActive"
           [active]="rla.isActive">
          {{link.label}}
        </a>
      </nav>

      <div class="grid-indent">

        <router-outlet></router-outlet>

      </div>

    </section>
  `
})
export class AuthtionProfileComponent implements OnInit {

  private navLinks: { path: string, label: string }[] = [
    {path: 'personal', label: 'Personal'}, // AuthtionPersonalComponent
    {path: 'email', label: 'Email'},       // AuthtionAccountEmailComponent
    {path: 'password', label: 'Password'}, // AuthtionAccountPasswordComponent
  ];

  constructor(protected router: Router,
              protected route: ActivatedRoute) {
  }

  ngOnInit() {
    this.router.navigate(['personal'], {relativeTo: this.route});
  }

}
