import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonAuthtionComponent} from './button-authtion.component';

describe('ButtonAuthtionComponent', () => {
  let component: ButtonAuthtionComponent;
  let fixture: ComponentFixture<ButtonAuthtionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonAuthtionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonAuthtionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
