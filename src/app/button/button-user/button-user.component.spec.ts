import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonUserComponent} from './button-user.component';

describe('ButtonUserComponent', () => {
  let component: ButtonUserComponent;
  let fixture: ComponentFixture<ButtonUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonUserComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
