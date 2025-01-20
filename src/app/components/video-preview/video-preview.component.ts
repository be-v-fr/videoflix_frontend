import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { VideoMeta } from '../../shared/models/video-meta';
import { RouterLink } from '@angular/router';
import { GlobalService } from '../../shared/services/global.service';


/**
 * Displays a viewport-size preview video to the user,
 * including an overlay with video metadata and a play button.
 */
@Component({
  selector: 'app-video-preview',
  standalone: true,
  imports: [VgCoreModule, VgStreamingModule, RouterLink],
  templateUrl: './video-preview.component.html',
  styleUrl: './video-preview.component.scss'
})
export class VideoPreviewComponent {
  @ViewChild('media', { static: true }) media!: ElementRef<HTMLVideoElement>;
  @Input({ required: true }) videoMeta!: VideoMeta;
  api: VgApiService = new VgApiService;


  constructor(
    private globalService: GlobalService,
  ) { }


  /**
   * Completes Videogular player initialization.
   */
  onPlayerReady(source: VgApiService): void {
    this.api = source;
  }


  /**
   * Locally - i.e. only in this compoenent instance - sets playback state to 20 %.
   */
  setLocalProgress(): void {
    const videoElement: HTMLVideoElement = this.media.nativeElement;
    videoElement.currentTime = videoElement.duration * 0.2;
  }


  /**
   * Handles scrolling events.
   * Automatically pauses or plays the video depending on the scrolling position.
   */
  @HostListener('window:scroll')
  @HostListener('document:mousedown')
  handleScrolling(): void {
    const videoElement: HTMLVideoElement = this.media.nativeElement;
    if (this.globalService.userClickedDuringVisit) {
      if (window.scrollY > 0.3 * window.innerHeight && !videoElement.paused) {
        videoElement.pause();
      } else if (videoElement.paused) {
        videoElement.play();
      }
    }
  }
}
