import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPasswordAuthtionComponent } from './input-password-authtion.component';

describe('InputPasswordAuthtionComponent', () => {
  let component: InputPasswordAuthtionComponent;
  let fixture: ComponentFixture<InputPasswordAuthtionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputPasswordAuthtionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputPasswordAuthtionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
