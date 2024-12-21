import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingCircleComponent } from '../../../shared/components/loading-circle/loading-circle.component';
import { VideoMeta } from '../../../shared/models/video-meta';
import { RouterLink } from '@angular/router';
import { VideoCompletion } from '../../../shared/models/video-completion';
import { VideosService } from '../../../shared/services/videos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, LoadingCircleComponent, RouterLink],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss'
})
export class VideoCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) metaData!: VideoMeta;
  completion?: VideoCompletion;
  completionSub: Subscription = new Subscription();
  progressWidth?: string;
  progressText?: string;


  constructor(
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
      if(s == 'complete') {
        this.completion = this.videosService.getVideoCompletion(this.metaData.id);
        this.progressWidth = this.calcProgressWidth();
        this.progressText = this.generateProgressText();
        this.completionSub.unsubscribe();
      }
    })
  }


  calcProgressWidth(): string {
    const relativeProgress: number = this.completion ? this.completion.currentTime / this.metaData.durationInSeconds : 0;
    return relativeProgress * 100 + '%';
  }


  generateProgressText(): string {
    let value: string = 'Unknown progress';
    if (this.completion && this.completion.currentTime > 0) {
      const durationSeconds: number = Math.round(this.metaData.durationInSeconds);
      if (durationSeconds == -1) {
        return value;
      } else if (durationSeconds < 60) {
        return `${Math.floor(this.completion.currentTime)} of ${durationSeconds} s`;
      } else {
        let progressMinutes: number = Math.floor(this.completion.currentTime / 60);
        let durationMinutes: number = Math.round(durationSeconds / 60);
        value = `${progressMinutes} of ${durationMinutes}`;
        return durationMinutes > 1 ? value + ' mins.' : value + ' min.';
      }
    }
    return value;
  }
}