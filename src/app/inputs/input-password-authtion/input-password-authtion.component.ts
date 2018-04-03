import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilsService} from '../../utils.service';

@Component({
  selector: 'app-input-password-authtion',
  templateUrl: './input-password-authtion.component.html',
  styles: ['']
})
export class InputPasswordAuthtionComponent implements OnInit {

  @Output() takePasswordGroup = new EventEmitter<FormGroup>();
  group: FormGroup;
  minLength = 6;
  maxLength = 55;
  isWrongControl = UtilsService.isWrongControl;

  ngOnInit() {

    this.group = new FormGroup({
      'password': new FormControl('', [
        Validators.required,
        this.lengthValidator.bind(this),
      ])
    });

    this.takePasswordGroup.emit(this.group);
  }

  lengthValidator(control: FormControl) {
    const length = control.value.length;
    if (length < this.minLength || length > this.maxLength) {
      return {
        'passwordLength': true
      };
    }
    return null;
  }

}
