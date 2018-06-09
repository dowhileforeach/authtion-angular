import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-alert-dwfe',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertDwfeComponent {

  @Input() private message = '';

  // Possible values:
  //    error
  @Input() private alertType = 'error';

  @Input() private blink = false;
  @Input() private noBorder = false;
}
