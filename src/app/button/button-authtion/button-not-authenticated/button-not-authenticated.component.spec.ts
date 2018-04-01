import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonNotAuthenticatedComponent} from './button-not-authenticated.component';

describe('ButtonNotAuthenticatedComponent', () => {
  let component: ButtonNotAuthenticatedComponent;
  let fixture: ComponentFixture<ButtonNotAuthenticatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonNotAuthenticatedComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonNotAuthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
