import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

import {MyErrorStateMatcherDwfe} from '@dwfe/classes/UtilsDwfe';
import {Subject} from 'rxjs/index';

@Component({
  selector: 'app-input-text-dwfe',
  templateUrl: './input-text.component.html'
})
export class InputTextDwfeComponent implements OnInit, OnDestroy {

  private group: FormGroup;
  @Output() private takeTextGroup = new EventEmitter<FormGroup>();
  private control: FormControl;

  @Input() private markIfChanged = true;
  private isFirstChange = true;
  private initValue: string;
  private hasBeenChanged = false;
  @Output() private takeHasBeenChanged = new EventEmitter<boolean>();

  @Input() private appearanceValue = 'fill'; // 'fill', 'standard', 'outline', and ''
  @Input() private labelText = 'Just text field';

  @Input() private tabIndexValue = 0;

  private matcher = new MyErrorStateMatcherDwfe();

  private latchForUnsubscribe = new Subject();

  ngOnInit(): void {
    this.control = new FormControl('', []);

    this.control.valueChanges.pipe(takeUntil(this.latchForUnsubscribe.asObservable()))
      .subscribe(value => {
        if (this.isFirstChange) {
          this.isFirstChange = false;
          this.initValue = value;
          return;
        }
        this.hasBeenChanged = value !== this.initValue;

        if (!this.initValue && value === '') {
          this.hasBeenChanged = false; // if init=null and has been changed to ''
        }

        this.takeHasBeenChanged.emit(this.hasBeenChanged);
      });

    this.group = new FormGroup({
      'txt': this.control
    });

    this.takeTextGroup.emit(this.group);
  }

  ngOnDestroy(): void {
    this.latchForUnsubscribe.next();
  }
}
