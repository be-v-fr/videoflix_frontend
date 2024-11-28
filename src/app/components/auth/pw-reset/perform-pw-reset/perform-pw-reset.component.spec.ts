import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformPwResetComponent } from './perform-pw-reset.component';

describe('PerformPwResetComponent', () => {
  let component: PerformPwResetComponent;
  let fixture: ComponentFixture<PerformPwResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformPwResetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformPwResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
