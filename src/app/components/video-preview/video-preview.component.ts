import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgHlsDirective, VgStreamingModule } from '@videogular/ngx-videogular/streaming';
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
  imports: [CommonModule, VgCoreModule, VgStreamingModule, RouterLink],
  templateUrl: './video-preview.component.html',
  styleUrl: './video-preview.component.scss'
})
export class VideoPreviewComponent {
  @ViewChild('media', { static: true }) media!: ElementRef<HTMLVideoElement>;
  @ViewChild(VgHlsDirective, { static: true }) vgHls!: VgHlsDirective;
  @Input({ required: true }) videoMeta!: VideoMeta;
  api: VgApiService = new VgApiService;
  settingPlayer: boolean = false;
  private hls: any;


  constructor(
    public globalService: GlobalService,
  ) { }


  /**
   * Completes Videogular player initialization.
   */
  onPlayerReady(source: VgApiService): void {
    this.api = source;
    this.initHlsInstance();
  }


  /**
   * Fetches HLS instance from Videogular.
   */
  private initHlsInstance(): void {
    setTimeout(() => {
      if (this.vgHls && this.vgHls.hls) {
        this.hls = this.vgHls.hls;
      }
    }, 500);
  }


  /**
   * Locally - i.e. only in this compoenent instance - sets playback state to 20 %.
   */
  setLocalProgress(): void {
    const videoElement: HTMLVideoElement = this.media.nativeElement;
    videoElement.currentTime = videoElement.duration * 0.2;
  }


  /**
   * Pauses the video and stops further video loading.
   */
  pauseAndStopLoading(): void {
    const videoElement: HTMLVideoElement = this.media.nativeElement;
    videoElement.pause();
    if (this.hls) {
      this.hls.stopLoad();
    }
  }


  /**
   * Handles scrolling events.
   * Automatically pauses or plays the video depending on the scrolling position.
   */
  @HostListener('window:scroll')
  @HostListener('document:mousedown')
  handleScrolling(): void {
    const videoElement: HTMLVideoElement = this.media.nativeElement;
    if (!this.settingPlayer && this.globalService.userClickedDuringVisit) {
      if (window.scrollY > 0.2 * window.innerHeight && !videoElement.paused) {
        this.pauseAndStopLoading();
      } else if (window.scrollY <= 0.2 * window.innerHeight && videoElement.paused) {
        this.settingPlayer = true;
        videoElement.play()
          .then(() => this.settingPlayer = false);
      }
    }
  }
}
