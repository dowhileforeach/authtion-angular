import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-date-picker-dwfe',
  templateUrl: './date-picker.component.html'
})
export class DatePickerDwfeComponent implements OnInit, OnDestroy {

  private group: FormGroup;
  @Output() private takeDateGroup = new EventEmitter<FormGroup>();
  private control: FormControl;

  @Input() private labelText = 'Choose a date';

  @Input() private inputDisabled = true;

  @Input() private markIfChanged = false;
  private isFirstChange = true;
  private initValue: string;
  private hasBeenChanged = false;
  @Output() private takeHasBeenChanged = new EventEmitter<boolean>();

  private latchForUnsubscribe = new Subject();

  ngOnInit(): void {
    this.control = new FormControl();
    if (this.inputDisabled) {
      this.control.disable();
    }

    this.control.valueChanges.pipe(takeUntil(this.latchForUnsubscribe.asObservable()))
      .subscribe(value => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
          this.initValue = value;
          return;
        }
        this.hasBeenChanged = value !== this.initValue;
        this.takeHasBeenChanged.emit(this.hasBeenChanged);
      });

    this.group = new FormGroup({
      'date': this.control
    });

    this.takeDateGroup.emit(this.group);
  }

  ngOnDestroy(): void {
    this.latchForUnsubscribe.next();
  }
}
