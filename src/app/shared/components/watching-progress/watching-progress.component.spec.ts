import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchingProgressComponent } from './watching-progress.component';

describe('WatchingProgressComponent', () => {
  let component: WatchingProgressComponent;
  let fixture: ComponentFixture<WatchingProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchingProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchingProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
