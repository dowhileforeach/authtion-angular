import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

import {AuthtionExchangeService} from '@dwfe/modules/authtion/services/authtion-exchange.service';

@Component({
  selector: 'app-authtion-page-restore-pass',
  templateUrl: './page-restore-pass.component.html',
  styleUrls: ['./page-restore-pass.component.scss']
})
export class AuthtionPageRestorePassComponent implements AfterViewInit {

  private isLocked = false;
  @ViewChild('refPendingOverlayWrap') private refPendingOverlayWrap: ElementRef;
  private errorMessage = '';

  constructor(protected exchangeService: AuthtionExchangeService,
              @Inject(MAT_DIALOG_DATA) protected data: any) {
  }

  ngAfterViewInit(): void {
  }

}
