import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth-button',
  templateUrl: './button-user.component.html',
  styleUrls: ['./button-user.component.scss']
})
export class ButtonUserComponent {

  constructor(private router: Router) {
  }

  openLoginPage() {
    this.router.navigate(['/login']);
  }
}
