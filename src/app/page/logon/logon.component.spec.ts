import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PageLogonComponent} from './logon.component';

describe('PageLogonComponent', () => {
  let component: PageLogonComponent;
  let fixture: ComponentFixture<PageLogonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageLogonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLogonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
