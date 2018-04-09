import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import {AuthtionService} from '../../authtion.service';

@Component({
  selector: 'app-btn-authtion-user',
  templateUrl: './btn-authtion__user.component.html',
  styleUrls: ['./btn-authtion__user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BtnAuthtionUserComponent implements OnInit {

  private isLoggedIn: Observable<boolean>;

  constructor(private authtionService: AuthtionService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authtionService.getLoggedIn();
  }
}
