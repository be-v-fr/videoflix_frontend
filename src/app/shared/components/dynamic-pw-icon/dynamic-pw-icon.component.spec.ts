import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPwIconComponent } from './dynamic-pw-icon.component';

describe('DynamicPwIconComponent', () => {
  let component: DynamicPwIconComponent;
  let fixture: ComponentFixture<DynamicPwIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicPwIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicPwIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
