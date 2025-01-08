import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitrateOptions, VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { VideoMeta } from '../../../shared/models/video-meta';
import { RouterLink } from '@angular/router';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { VideosService } from '../../../shared/services/videos.service';
import { VideoCompletion } from '../../../shared/models/video-completion';
import { BackBtnComponent } from '../../../shared/components/back-btn/back-btn.component';
import { LogoComponent } from '../../../shared/components/logo/logo.component';

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


  constructor(
    private videosService: VideosService,
  ) { }


  ngOnInit(): void {
    this.initVideoCompletion();
    this.setInactivityTimer();
    this.startProgressTracking();
  }


  ngOnDestroy() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }


  onPlayerReady(source: VgApiService) {
    this.api = source;
  }


  initBitrates(bitrates: BitrateOptions[]) {
    bitrates.forEach(b => b.label = this.generateBitrateLabel(b.bitrate));
    this.hlsBitrates = bitrates;
  }


  generateBitrateLabel(bitrate: number): string {
    switch (bitrate) {
      case 0: return 'auto';
      case 350000: return '120p';
      case 1000000: return '360p';
      case 3000000: return '720p';
      case 5000000: return '1080p';
      default: return bitrate / 1000000 + ' mbit/s';
    }
  }


  onBitrateChange(bitrate: BitrateOptions): void {
    this.toastBitrateMsg = bitrate.label;
  }


  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:mousedown', ['$event'])
  @HostListener('document:mouseup', ['$event'])
  handleMouseActivity() {
    this.resetInactivityTimer();
    this.showingPlayer = true;
  }


  private setInactivityTimer() {
    const videoElement: HTMLVideoElement = this.media.nativeElement;
    this.inactivityTimer = setTimeout(() => {
      if (!videoElement.paused) {
        this.showingPlayer = false;
      }
    }, 3500);
  }


  private resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.setInactivityTimer();
  }


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


  initVideoCompletion(): void {
    const completion: VideoCompletion | undefined = this.videosService.getVideoCompletion(this.videoMeta.id);
    this.videoCompletion.videoId = this.videoMeta.id;
    if (completion) {
      this.videoCompletion = completion;
      if (completion.currentTime > 0) {
        const videoElement: HTMLVideoElement = this.media.nativeElement;
        videoElement.currentTime = completion.currentTime;
      }
    }
  }


  startProgressTracking() {
    setInterval(() => {
      this.saveProgress();
    }, 1000);
  }


  saveProgress() {
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


  saveProgressInRuntime(videoElement: HTMLVideoElement) {
    this.videoCompletion.currentTime = videoElement.currentTime;
    this.videoCompletion.updatedAt = new Date();
    this.videosService.saveVideoCompletionInRuntime(this.videoCompletion);
  }
};