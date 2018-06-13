import {Component, Input} from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-clear-control-dwfe',
  templateUrl: './clear-control.component.html',
  styleUrls: ['./clear-control.component.scss'],
})
export class ClearControlDwfeComponent {
  @Input() private control: AbstractControl;
}
