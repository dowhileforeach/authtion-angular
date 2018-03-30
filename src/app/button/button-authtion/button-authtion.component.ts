import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-button-authtion',
  templateUrl: './button-authtion.component.html',
  styleUrls: ['./button-authtion.component.scss']
})
export class ButtonAuthtionComponent {

  constructor(private router: Router) {
  }

  openLoginPage() {
    this.router.navigate(['/login']);
  }
}
