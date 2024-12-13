import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import Hls from 'hls.js';
import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VideoMeta } from '../../../shared/models/video-meta';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnInit {
  @Input({ required: true }) videoMeta!: VideoMeta;
  @ViewChild('media') videoRef!: ElementRef;
  api: VgApiService = new VgApiService;
  private readonly ALLOWED_RESOLUTIONS: number[] = [480, 720, 1080];
  videoResolutionInP: number = this.ALLOWED_RESOLUTIONS[1];


  get videoSrc(): string {
    return this.videoMeta.videoFilesUrl + '/'
      + this.videoMeta.id + '_'
      + this.videoResolutionInP + 'p.m3u8';
  }


  ngOnInit(): void {
    this.setResAuto();
  }


  ngAfterViewInit() {
    this.loadHlsVideoSrc();
  }


  onPlayerReady(source: VgApiService) {
    this.api = source;
  }


  loadHlsVideoSrc() {
    const video = this.videoRef.nativeElement;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(this.videoSrc);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.videoSrc;
    } else {
      console.error('This browser does not support this type of video.');
    }
  }
  

  setResAuto(): void {
    const maxAllowedRes: number = this.ALLOWED_RESOLUTIONS[this.ALLOWED_RESOLUTIONS.length - 1];
    const minResLargerThanVh: number = Math.min(
      ...this.ALLOWED_RESOLUTIONS.filter(r => r >= window.innerHeight)
    );
    this.videoResolutionInP = minResLargerThanVh > maxAllowedRes ? maxAllowedRes : minResLargerThanVh;
  }


  setRes(res: 480 | 720 | 1080 | 'auto'): void {
    res == 'auto' ? this.setResAuto() : this.videoResolutionInP = res;
  }
};