import { Component, Input, OnInit, OnDestroy, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingCircleComponent } from '../../../shared/components/loading-circle/loading-circle.component';
import { VideoMeta } from '../../../shared/models/video-meta';
import { RouterLink } from '@angular/router';
import { VideoCompletion } from '../../../shared/models/video-completion';
import { VideosService } from '../../../shared/services/videos.service';
import { Subscription } from 'rxjs';
import { WatchingProgressComponent } from '../../../shared/components/watching-progress/watching-progress.component';
import { DialogContinueWatchingComponent } from '../../../shared/components/dialog-continue-watching/dialog-continue-watching.component';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, LoadingCircleComponent, RouterLink, WatchingProgressComponent, DialogComponent],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss'
})
export class VideoCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) metaData!: VideoMeta;
  completion?: VideoCompletion;
  completionSub: Subscription = new Subscription();
  continueWatchingComponent: Type<object> = DialogContinueWatchingComponent;
  showingContinueWatchingDialog: boolean = false;


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
        this.completionSub.unsubscribe();
      }
    })
  }
}