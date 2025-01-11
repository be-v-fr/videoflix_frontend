import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingCircleComponent } from '../../../shared/components/loading-circle/loading-circle.component';
import { VideoMeta } from '../../../shared/models/video-meta';
import { Router } from '@angular/router';
import { VideoCompletion } from '../../../shared/models/video-completion';
import { VideosService } from '../../../shared/services/videos.service';
import { Subscription } from 'rxjs';
import { WatchingProgressComponent } from '../../../shared/components/watching-progress/watching-progress.component';
import { DurationComponent } from '../../../shared/components/duration/duration.component';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, LoadingCircleComponent, WatchingProgressComponent, DurationComponent],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss'
})
export class VideoCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) metaData!: VideoMeta;
  @Output() continue: EventEmitter<{ meta: VideoMeta, completion: VideoCompletion }> = new EventEmitter();
  @Output() details: EventEmitter<{ meta: VideoMeta, completion?: VideoCompletion }> = new EventEmitter();
  completion?: VideoCompletion;
  completionSub: Subscription = new Subscription();
  yPositionInViewport: 'neutral' | 'top' | 'bottom' = 'neutral';


  constructor(
    private router: Router,
    private videosService: VideosService,
  ) { }


  ngOnInit(): void {
    if (!this.completion) {
      this.completionSub = this.subCompletion();
    }
  }


  ngOnDestroy(): void {
    this.completionSub.unsubscribe();
  }


  subCompletion(): Subscription {
    return this.completionSub = this.videosService.loadingState.subscribe(s => {
      if (s == 'complete') {
        this.completion = this.videosService.getVideoCompletion(this.metaData.id);
        this.completionSub.unsubscribe();
      }
    })
  }


  playVideo(): void {
    if (this.completion) {
      this.continue.emit({
        meta: this.metaData,
        completion: this.completion
      });
    } else {
      this.router.navigate(['video', this.metaData.id]);
    }
  }


  showDetails(): void {
    this.details.emit({
      meta: this.metaData,
      completion: this.completion
    });
  }


  updateYPosition(ev: MouseEvent): void {
      const element = ev.target as HTMLElement;
      const boundingRect = element.getBoundingClientRect();
      const minDistance = 60;
      const distanceFromTop = boundingRect.top;
      const distanceFromBottom = window.innerHeight - boundingRect.bottom;
      this.yPositionInViewport = this.getYPosition(minDistance, distanceFromTop, distanceFromBottom);
  }


  getYPosition(minDist: number, distFromTop: number, distFromBottom: number): 'neutral' | 'top' | 'bottom' {
    if (distFromTop < minDist) {
      return 'top';
    } else if (distFromBottom < minDist) {
      return 'bottom';
    } else {
      return 'neutral';
    }
  }
}