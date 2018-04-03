import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEmailAuthtionComponent } from './input-email-authtion.component';

describe('InputEmailAuthtionComponent', () => {
  let component: InputEmailAuthtionComponent;
  let fixture: ComponentFixture<InputEmailAuthtionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputEmailAuthtionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputEmailAuthtionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
