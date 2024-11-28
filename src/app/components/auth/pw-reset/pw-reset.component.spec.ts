import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwResetComponent } from './pw-reset.component';

describe('PwResetComponent', () => {
  let component: PwResetComponent;
  let fixture: ComponentFixture<PwResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwResetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PwResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
