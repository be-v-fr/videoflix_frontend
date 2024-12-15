import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BitrateOptions, VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
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
export class PlayerComponent {
  @Input({ required: true }) videoMeta!: VideoMeta;
  @ViewChild('media') videoRef!: ElementRef;
  api: VgApiService = new VgApiService;
  hlsBitrates?: BitrateOptions[];


  onPlayerReady(source: VgApiService) {
    this.api = source;
  }


  initBitrates(bitrates: BitrateOptions[]) {
    this.hlsBitrates = bitrates;
    this.hlsBitrates.forEach(b => {
      switch(b.qualityIndex) {
        case 0: b.label = 'auto'; break;
        case 1: b.label = '480p'; break;
        case 2: b.label = '720p'; break;
        case 3: b.label = '1080p'
      }
    });
  }
};