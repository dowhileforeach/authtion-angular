import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonLoggedInComponent} from './button-logged-in.component';

describe('ButtonLoggedInComponent', () => {
  let component: ButtonLoggedInComponent;
  let fixture: ComponentFixture<ButtonLoggedInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonLoggedInComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonLoggedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
