import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PageAuthtionLoginComponent} from './page-authtion-login.component';

describe('PageAuthtionLoginComponent', () => {
  let component: PageAuthtionLoginComponent;
  let fixture: ComponentFixture<PageAuthtionLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageAuthtionLoginComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAuthtionLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
