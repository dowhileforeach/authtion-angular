import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyMainComponent } from './body-main.component';

describe('BodyMainComponent', () => {
  let component: BodyMainComponent;
  let fixture: ComponentFixture<BodyMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
