import {Component, ViewEncapsulation} from '@angular/core';

import {AuthtionService} from '../services/authtion.service';

@Component({
  selector: 'app-authtion-btn-user',
  templateUrl: './btn-user.component.html',
  styleUrls: ['./btn-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthtionBtnUserComponent {
  constructor(protected authtionService: AuthtionService) {
  }
}
