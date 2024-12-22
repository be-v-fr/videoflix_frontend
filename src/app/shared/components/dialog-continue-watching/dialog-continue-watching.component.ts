import { Component, Input, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WatchingProgressComponent } from '../watching-progress/watching-progress.component';
import { VideosService } from '../../services/videos.service';
import { VideoCompletion } from '../../models/video-completion';
import { VideoMeta } from '../../models/video-meta';

@Component({
  selector: 'app-dialog-continue-watching',
  standalone: true,
  imports: [CommonModule, WatchingProgressComponent],
  templateUrl: './dialog-continue-watching.component.html',
  styleUrl: './dialog-continue-watching.component.scss'
})
export class DialogContinueWatchingComponent implements OnInit {
  @Input({ required: true }) metaData!: VideoMeta;
  @Input({ required: true }) completion!: VideoCompletion;
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
    if(!this.completion) {
      this.metaData ? this.playVideo() : this.closeDialog();
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
    this.completion = this.data.completion;
  }


  private validateInjection(data: any): data is { metaData: VideoMeta; completion: VideoCompletion } {
    return data &&
      typeof data === 'object' &&
      data.metaData instanceof VideoMeta &&
      data.completion instanceof VideoCompletion;
  }


  playVideo() {
    this.router.navigate(['video', this.metaData.id]);
  }


  playVideoFromStart() {
    this.completion.currentTime = 0;
    this.videosService.saveVideoCompletionInRuntime(this.completion);
    this.playVideo();
  }
}
