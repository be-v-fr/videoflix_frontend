import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { BitrateOptions, VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { VideoMeta } from '../../../shared/models/video-meta';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule, VgStreamingModule, RouterLink],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) videoMeta!: VideoMeta;
  api: VgApiService = new VgApiService;
  hlsBitrates?: BitrateOptions[];
  showingPlayer: boolean = true;
  private inactivityTimer?: ReturnType<typeof setTimeout>;


  ngOnInit(): void {
    this.setInactivityTimer();
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
    bitrates.forEach(b => {
      switch(b.qualityIndex) {
        case 0: b.label = 'auto'; break;
        case 1: b.label = '480p'; break;
        case 2: b.label = '720p'; break;
        case 3: b.label = '1080p'
      }
    });
    this.hlsBitrates = bitrates;
  }


  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:mousedown', ['$event'])
  handleMouseActivity() {
    this.resetInactivityTimer();
    this.showingPlayer = true;
  }


  private setInactivityTimer() {
    this.inactivityTimer = setTimeout(() => {
      this.showingPlayer = false;
    }, 3500);
  }


  private resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.setInactivityTimer();
  }
};