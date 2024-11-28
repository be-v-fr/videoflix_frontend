import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPwResetComponent } from './request-pw-reset.component';

describe('RequestPwResetComponent', () => {
  let component: RequestPwResetComponent;
  let fixture: ComponentFixture<RequestPwResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPwResetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPwResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
