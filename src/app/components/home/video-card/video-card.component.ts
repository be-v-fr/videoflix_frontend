import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingCircleComponent } from '../../../shared/components/loading-circle/loading-circle.component';
import { VideoMeta } from '../../../shared/models/video-meta';
import { Router } from '@angular/router';
import { VideoCompletion } from '../../../shared/models/video-completion';
import { VideosService } from '../../../shared/services/videos.service';
import { Subscription } from 'rxjs';
import { WatchingProgressComponent } from '../../../shared/components/watching-progress/watching-progress.component';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, LoadingCircleComponent, WatchingProgressComponent],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss'
})
export class VideoCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) metaData!: VideoMeta;
  @Input() verticalPositionInViewport: 'center' | 'top' | 'bottom' = 'center';
  @Output() continue: EventEmitter<{ meta: VideoMeta, completion: VideoCompletion }> = new EventEmitter();
  completion?: VideoCompletion;
  completionSub: Subscription = new Subscription();


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
}