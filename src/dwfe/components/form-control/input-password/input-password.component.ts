import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {MyErrorStateMatcherDwfe} from '@dwfe/classes/UtilsDwfe';

@Component({
  selector: 'app-input-password-dwfe',
  templateUrl: './input-password.component.html'
})
export class InputPasswordDwfeComponent implements OnInit {

  private minLength = 6;
  private maxLength = 55;

  private group: FormGroup;
  @Output() private takePasswordGroup = new EventEmitter<FormGroup>();
  private passwordControl: FormControl;

  @Input() private labelText = 'Password';
  @Input() private hintText = '';

  @Input() private tabIndexValue = 0;

  private matcher = new MyErrorStateMatcherDwfe();

  private hide = true;

  ngOnInit() {
    this.passwordControl = new FormControl('', [
      Validators.required,
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength),
    ]);

    this.group = new FormGroup({
      'password': this.passwordControl
    });

    this.takePasswordGroup.emit(this.group);
  }

  private switchHide(): void {
    this.hide = !this.hide;
  }
}
