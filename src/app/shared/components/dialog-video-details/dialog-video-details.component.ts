import { Component, Input, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VideosService } from '../../services/videos.service';
import { VideoCompletion } from '../../models/video-completion';
import { VideoMeta } from '../../models/video-meta';
import { WatchingProgressComponent } from '../watching-progress/watching-progress.component';
import { DurationComponent } from '../duration/duration.component';

@Component({
  selector: 'app-dialog-video-details',
  standalone: true,
  imports: [CommonModule, WatchingProgressComponent, DurationComponent],
  templateUrl: './dialog-video-details.component.html',
  styleUrl: './dialog-video-details.component.scss'
})
export class DialogVideoDetailsComponent {
  @Input({ required: true }) metaData!: VideoMeta;
  @Input() completion?: VideoCompletion;
  @Output() close = new EventEmitter<void>();


  constructor(
    @Inject('DIALOG_DATA') public data: any,
    private router: Router,
    private videosService: VideosService
  ) { }


  ngOnInit(): void {
    if (!(this.metaData && this.completion)) {
      this.injectData();
    }
  }


  closeDialog() {
    this.close.emit();
  }


  private injectData(): void {
    if (!this.validateInjection(this.data)) {
      console.error('Invalid data.');
      return;
    }
    this.metaData = this.data.metaData;
    if (this.data.completion) {
      this.completion = this.data.completion;
    }
  }


  private validateInjection(data: any): data is { metaData: VideoMeta; completion?: VideoCompletion } {
    return data &&
      typeof data === 'object' &&
      data.metaData instanceof VideoMeta &&
      (!data.completion || data.completion instanceof VideoCompletion);
  }


  playVideo() {
    this.router.navigate(['video', this.metaData.id]);
  }


  playVideoFromStart() {
    if (this.completion) {
      this.completion.currentTime = 0;
      this.videosService.saveVideoCompletionInRuntime(this.completion);
    }
    this.playVideo();
  }
}
