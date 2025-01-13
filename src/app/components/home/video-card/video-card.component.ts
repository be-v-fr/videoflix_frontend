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


/**
 * Component representing a single video card.
 * Displays video metadata and provides actions for playing or viewing details.
 */
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


  /**
   * Subscribes to video completion updates if they are not already loaded.
   */
  ngOnInit(): void {
    if (!this.completion) {
      this.completionSub = this.subCompletion();
    }
  }


  /**
   * Unsubscribes from any active subscriptions.
   */
  ngOnDestroy(): void {
    this.completionSub.unsubscribe();
  }


  /**
   * Subscribes to the video completion data and updates the local "completion" property when available.
   */
  subCompletion(): Subscription {
    return this.completionSub = this.videosService.loadingState.subscribe(s => {
      if (s == 'complete') {
        this.completion = this.videosService.getVideoCompletion(this.metaData.id);
        this.completionSub.unsubscribe();
      }
    })
  }


  /**
   * Handles the action of playing the video.
   * Emits a "continue" event if completion data is available, otherwise navigates to the video player.
   */
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


  /**
   * Handles the action of showing video details.
   * Emits a "details" event with the current metadata and completion data.
   */
  showDetails(): void {
    this.details.emit({
      meta: this.metaData,
      completion: this.completion
    });
  }


  /**
   * Updates the vertical position of the video card relative to the viewport.
   * @param {MouseEvent} ev The mouse entering event triggered by user interaction.
   */
  updateYPosition(ev: MouseEvent): void {
      const element = ev.target as HTMLElement;
      const boundingRect = element.getBoundingClientRect();
      const minDistance = 60;
      const distanceFromTop = boundingRect.top;
      const distanceFromBottom = window.innerHeight - boundingRect.bottom;
      this.yPositionInViewport = this.getYPosition(minDistance, distanceFromTop, distanceFromBottom);
  }


  /**
   * Determines the position ('neutral', 'top', or 'bottom') of the video card based on distances.
   * @param {number} minDist Minimum distance to consider a position as 'neutral'.
   * @param {number} distFromTop Distance from the top of the viewport.
   * @param {number} distFromBottom Distance from the bottom of the viewport.
   */
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