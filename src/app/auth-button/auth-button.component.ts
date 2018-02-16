import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.css']
})
export class AuthButtonComponent {

  constructor(private router: Router) {
  }

  openLogonPage() {
    this.router.navigate(['/logon']);
  }
}
