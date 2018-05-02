import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-alert-dwfe',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertDwfeComponent {

  @Input() message: string;

  // Possible values:
  //    error
  @Input() alertType: string;

  @Input() blink: boolean;
  @Input() noBorder: boolean;

  @Input() isDismissable = false;

}
