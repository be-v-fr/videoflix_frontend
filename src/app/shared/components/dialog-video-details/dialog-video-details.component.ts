import { Component, Input, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VideosService } from '../../services/videos.service';
import { VideoCompletion } from '../../models/video-completion';
import { VideoMeta } from '../../models/video-meta';
import { WatchingProgressComponent } from '../watching-progress/watching-progress.component';
import { DurationComponent } from '../duration/duration.component';


/**
 * Dialog that shows video details to the user, including a play button and a resume button if applicable.
 */
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


  /**
   * Initializes necessary data.
   */
  ngOnInit(): void {
    if (!(this.metaData && this.completion)) {
      this.injectData();
    }
  }


  /**
   * Closes the dialog by emitting the close event.
   */
  closeDialog() {
    this.close.emit();
  }


  /**
   * Injects data into the component if available and validates it.
   */
  private injectData(): void {
    if (this.validateInjection(this.data)) {
      this.metaData = this.data.metaData;
      if (this.data.completion) {
        this.completion = this.data.completion;
      }
    } else {
      console.error('Invalid data.');
    }
  }


  /**
   * Validates the injected data structure.
   * @param {any} data - The data to validate.
   */
  private validateInjection(data: any): data is { metaData: VideoMeta; completion?: VideoCompletion } {
    return data &&
      typeof data === 'object' &&
      data.metaData instanceof VideoMeta &&
      (!data.completion || data.completion instanceof VideoCompletion);
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
    if (this.completion) {
      this.completion.currentTime = 0;
      this.videosService.saveVideoCompletionInRuntime(this.completion);
    }
    this.playVideo();
  }
}
