import {Component} from '@angular/core';

@Component({
  selector: 'app-logon-page',
  templateUrl: './logon-page.component.html',
  styleUrls: ['./logon-page.component.css']
})
export class LogonPageComponent {
  email = '';
  password = '';
  translate = 0;

  trimmedStrIsEmpty(value): boolean {
    let result = true;
    if (value) {
      result = value.trim().length === 0;
    }
    return result;
  }

  changeSlide(translate) {
    this.translate = translate;
    console.log('translate=' + this.translate);
    console.log('------------');
  }
}
