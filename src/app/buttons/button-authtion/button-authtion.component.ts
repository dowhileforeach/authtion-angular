import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthtionService} from '../../authtion.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-button-authtion',
  templateUrl: './button-authtion.component.html',
  styleUrls: ['./button-authtion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonAuthtionComponent implements OnInit {

  isLoggedIn: Observable<boolean>;

  constructor(private authtionService: AuthtionService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authtionService.isLoggedIn();
  }
}
