import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogonPageComponent } from './logon-page.component';

describe('LogonPageComponent', () => {
  let component: LogonPageComponent;
  let fixture: ComponentFixture<LogonPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogonPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
