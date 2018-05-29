import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-authtion-page-restore-pass',
  templateUrl: './page-restore-pass.component.html',
  styleUrls: ['./page-restore-pass.component.scss']
})
export class AuthtionPageRestorePassComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

}
