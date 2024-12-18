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
    bitrates.forEach(b => b.label = this.getBitrateLabel(b.bitrate));
    this.hlsBitrates = bitrates;
  }


  getBitrateLabel(bitrate: number): string {
    switch(bitrate) {
      case 0: return 'auto';
      case 350000: return '120p';
      case 1000000: return '360p';
      case 3000000: return '720p';
      case 5000000: return '1080p';
      default: return bitrate / 1000000 + ' mbit/s';
    }    
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