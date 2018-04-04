import {Component, OnInit} from '@angular/core';
import {AuthtionService} from '../../authtion.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-btn-authtion-user',
  templateUrl: './btn-authtion__user.component.html',
  styles: ['']
})
export class BtnAuthtionUserComponent implements OnInit {

  isLoggedIn: Observable<boolean>;

  constructor(private authtionService: AuthtionService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authtionService.isLoggedIn();
  }
}
