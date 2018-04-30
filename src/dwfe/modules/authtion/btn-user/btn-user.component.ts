import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import {AuthtionService} from '../services/authtion.service';

@Component({
  selector: 'app-authtion-btn-user',
  templateUrl: './btn-user.component.html',
  styleUrls: ['./btn-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthtionBtnUserComponent implements OnInit {

  private isLoggedIn: Observable<boolean>;

  constructor(private authtionService: AuthtionService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authtionService.getLoggedIn();
  }
}
