import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { VideoMeta } from '../../../shared/models/video-meta';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule, VgStreamingModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnInit {
  @Input({ required: true }) videoMeta!: VideoMeta;
  @ViewChild('media') videoRef!: ElementRef;
  api: VgApiService = new VgApiService;
  readonly ALLOWED_RESOLUTIONS: number[] = [480, 720, 1080];
  videoResolutionInP: number = this.ALLOWED_RESOLUTIONS[1];


  ngOnInit(): void {
    this.setResAuto();
  }


  onPlayerReady(source: VgApiService) {
    this.api = source;
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