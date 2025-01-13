import { Component, Input, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WatchingProgressComponent } from '../watching-progress/watching-progress.component';
import { VideosService } from '../../services/videos.service';
import { VideoCompletion } from '../../models/video-completion';
import { VideoMeta } from '../../models/video-meta';
import { DialogService } from '../../services/dialog.service';


/**
 * Dialog that asks the user if he wants to continue or resume a selected video,
 * including the video thumbnail and watching progress.
 */
@Component({
  selector: 'app-dialog-continue-watching',
  standalone: true,
  imports: [CommonModule, WatchingProgressComponent],
  templateUrl: './dialog-continue-watching.component.html',
  styleUrl: './dialog-continue-watching.component.scss',
})
export class DialogContinueWatchingComponent implements OnInit {
  @Input({ required: true }) metaData!: VideoMeta;
  @Input({ required: true }) completion!: VideoCompletion;
  @Output() close = new EventEmitter<void>();


  constructor(
    @Inject('DIALOG_DATA') public data: any,
    private router: Router,
    private videosService: VideosService,
    private dialogService: DialogService,
  ) { }


  /**
   * Initializes necessary data and automatically starts the video or cancels the
   * dialog if data is missing.
   */
  ngOnInit(): void {
    if (!(this.metaData && this.completion)) {
      this.injectData();
    }
    if(!this.completion) {
      this.metaData ? this.playVideo() : this.closeDialog();
    } 
  }


  /**
   * Closes opened dialogs of this type.
   */
  closeDialog() {
    this.dialogService.close(DialogContinueWatchingComponent);
  }


  /**
   * Injects data into the component if available and validates it.
   */
  private injectData(): void {
    if (this.validateInjection(this.data)) {
      this.metaData = this.data.metaData;
      this.completion = this.data.completion;
    } else {
      console.error('Invalid data.');
    }
  }


  /**
   * Validates the injected data structure.
   * @param {any} data - The data to validate.
   */
  private validateInjection(data: any): data is { metaData: VideoMeta; completion: VideoCompletion } {
    return data &&
      typeof data === 'object' &&
      data.metaData instanceof VideoMeta &&
      data.completion instanceof VideoCompletion;
  }


  /**
   * Navigates to the video playback page for the current video.
   */
  playVideo() {
    this.router.navigate(['video', this.metaData.id]);
  }


  /**
   * Resets the video progress to the start and navigates to the video playback page.
   */
  playVideoFromStart() {
    this.completion.currentTime = 0;
    this.videosService.saveVideoCompletionInRuntime(this.completion);
    this.playVideo();
  }
}
