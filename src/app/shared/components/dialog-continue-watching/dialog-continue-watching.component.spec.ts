import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContinueWatchingComponent } from './dialog-continue-watching.component';

describe('DialogContinueWatchingComponent', () => {
  let component: DialogContinueWatchingComponent;
  let fixture: ComponentFixture<DialogContinueWatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogContinueWatchingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogContinueWatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
