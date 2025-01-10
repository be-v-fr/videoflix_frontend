import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVideoDetailsComponent } from './dialog-video-details.component';

describe('DialogVideoDetailsComponent', () => {
  let component: DialogVideoDetailsComponent;
  let fixture: ComponentFixture<DialogVideoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogVideoDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogVideoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
