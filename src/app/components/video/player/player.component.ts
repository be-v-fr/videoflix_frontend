import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitrateOptions, VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { VideoMeta } from '../../../shared/models/video-meta';
import { Router, RouterLink } from '@angular/router';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { VideosService } from '../../../shared/services/videos.service';
import { VideoCompletion } from '../../../shared/models/video-completion';
import { BackBtnComponent } from '../../../shared/components/back-btn/back-btn.component';
import { LogoComponent } from '../../../shared/components/logo/logo.component';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../../shared/services/global.service';


/**
 * Videogular video player component, playing HLS videos.
 */
@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    RouterLink,
    ToastNotificationComponent,
    LogoComponent,
    BackBtnComponent
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('media', { static: true }) media!: ElementRef<HTMLVideoElement>;
  @Input({ required: true }) videoMeta!: VideoMeta;
  videoCompletion: VideoCompletion = new VideoCompletion({});
  api: VgApiService = new VgApiService;
  hlsBitrates?: BitrateOptions[];
  showingPlayer: boolean = true;
  private inactivityTimer?: ReturnType<typeof setTimeout>;
  toastBitrateMsg?: string;
  private requestedCompletion: boolean = false;


  constructor(
    private router: Router,
    private videosService: VideosService,
    private globalService: GlobalService,
  ) { }


  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.initVideoCompletion();
    this.setInactivityTimer();
    this.startProgressTracking();
  }


  /** 
   * Cleans up resources when the component is destroyed.
   */
  ngOnDestroy() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }


  /**
   * Completes the Videogular API setup.
   */
  onPlayerReady(source: VgApiService) {
    this.api = source;
  }


  /**
   * Initializes available bitrates with user-friendly labels.
   */
  initBitrates(bitrates: BitrateOptions[]) {
    bitrates.forEach(b => b.label = this.generateBitrateLabel(b.bitrate));
    this.hlsBitrates = bitrates;
  }


  /**
   * Generates a human-readable label for a given bitrate.
   * @param {number} bitrate The bitrate value in bits per second.
   * @returns {string} The formatted bitrate label.
   */
  generateBitrateLabel(bitrate: number): string {
    switch (bitrate) {
      case 0: return 'auto';
      case 1000000: return '360p';
      case 1500000: return '480p';
      case 3000000: return '720p';
      case 5000000: return '1080p';
      default: return bitrate / 1000000 + ' mbit/s';
    }
  }


  /**
   * Updates the bitrate selection and displays a message.
   * @param {BitrateOptions} bitrate The selected bitrate.
   */
  onBitrateChange(bitrate: BitrateOptions): void {
    this.toastBitrateMsg = bitrate.label;
  }


  /**
   * Handles mouse movement and click events.
   */
  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:mousedown', ['$event'])
  @HostListener('document:mouseup', ['$event'])
  handleMouseActivity(): void {
    this.resetInactivityTimer();
    this.showingPlayer = true;
  }


  /**
   * Sets a timer to detect user inactivity.
   */
  private setInactivityTimer(): void {
    const videoElement: HTMLVideoElement = this.media.nativeElement;
    this.inactivityTimer = setTimeout(() => {
      if (!videoElement.paused) {
        this.showingPlayer = false;
      }
    }, 3500);
  }


  /** 
   * Resets the inactivity timer.
   */
  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.setInactivityTimer();
  }


  /**
   * Seeks the video forward or backward by a specified number of seconds.
   */
  seek(seconds: number): void {
    const videoElement: HTMLVideoElement = this.media.nativeElement;
    let newTime = videoElement.currentTime + seconds;
    if (newTime < 0) {
      newTime = 0;
    } else if (newTime > videoElement.duration) {
      newTime = videoElement.duration;
    }
    videoElement.currentTime = newTime;
  }


  /** 
   * Initializes the video playback position from saved progress, if available.
   * Tries loading video completion from the server, if not.
   */
  initVideoCompletion(): void {
    const completion: VideoCompletion | undefined = this.videosService.getVideoCompletion(this.videoMeta.id);
    this.videoCompletion.videoId = this.videoMeta.id;
    if (completion) {
      this.handleVideoCompletion(completion);
    } else if (!this.requestedCompletion) {
      this.handleVideoCompletionLoading();
      this.requestedCompletion = true;
    }
  }


  /**
   * Applies video completion data to the player, setting the playback state.
   */
  handleVideoCompletion(completion: VideoCompletion): void {
    this.videoCompletion = completion;
    if (completion.currentTime > 0) {
      const videoElement: HTMLVideoElement = this.media.nativeElement;
      videoElement.currentTime = completion.currentTime;
      if (this.globalService.userClickedDuringVisit) {
        videoElement.play();
      }
    }
  }


  /**
   * Handles the current video completion data loading state to retrieve completion data, if available.
   */
  handleVideoCompletionLoading(): void {
    if (this.videosService.loadingState.getValue() !== 'complete') {
      this.initVideoCompletionLoadingIfNecessary();
      const loadingSub: Subscription = this.videosService.loadingState.subscribe(ls => {
        if (ls === 'complete') {
          const videoCompletion: VideoCompletion | undefined = this.videosService.getVideoCompletion(this.videoMeta.id);
          if (videoCompletion) {
            this.handleVideoCompletion(videoCompletion);
          }
          loadingSub.unsubscribe();
        }
      })
    }
  }


  /**
   * If video completion is not currently loading, initializes loading.
   */
  initVideoCompletionLoadingIfNecessary(): void {
    if (this.videosService.loadingState.getValue() !== 'completion') {
      this.videosService.initVideoCompletionData();
    }
  }


  /**
   * Starts tracking video playback progress using the specified update interval.
   */
  startProgressTracking(): void {
    setInterval(() => {
      this.saveProgress();
    }, 1000);
  }


  /**
   * Saves playback progress to the server and runtime storage.
   */
  saveProgress(): void {
    const videoElement: HTMLVideoElement = this.media.nativeElement;
    if (!videoElement.paused) {
      this.saveProgressInRuntime(videoElement);
      this.videosService.saveVideoCompletionOnServer(this.videoCompletion)
        .then((resp: any) => {
          this.videoCompletion.id = resp.id;
          this.saveProgressInRuntime(videoElement);
        })
        .catch((err: any) => console.error(err));
    }
  }


  /**
   * Saves playback progress to runtime storage.
   */
  saveProgressInRuntime(videoElement: HTMLVideoElement): void {
    this.videoCompletion.currentTime = videoElement.currentTime;
    this.videoCompletion.updatedAt = new Date();
    this.videosService.saveVideoCompletionInRuntime(this.videoCompletion);
  }


  /**
   * Handles keyboard shortcuts for playback control.
   */
  @HostListener('document:keydown', ['$event'])
  onKeydown(ev: KeyboardEvent): void {
    switch (ev.key) {
      case 'Escape': this.exit(); break;
      case ' ':
      case 'k': this.togglePlayState(); break;
      case 'ArrowLeft':
      case ',': this.seek(-1); break;
      case 'ArrowRight':
      case '.': this.seek(+1); break;
    }
  }


  /**
   * Exits the video player by saving the progress and navigating to the home page.
   */
  exit(): void {
    this.saveProgress();
    this.router.navigateByUrl('');
  }


  /**
   * Toggles the play/pause state of the video.
   */
  togglePlayState(): void {
    const videoElement: HTMLVideoElement = this.media.nativeElement;
    videoElement.paused ? videoElement.play() : videoElement.pause();
  }
};