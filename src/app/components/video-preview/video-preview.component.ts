import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { VideoMeta } from '../../shared/models/video-meta';
import { RouterLink } from '@angular/router';

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


  onPlayerReady(source: VgApiService) {
    this.api = source;
  }


  setLocalProgress() {
    const videoElement: HTMLVideoElement = this.media.nativeElement;
    videoElement.currentTime = videoElement.duration * 0.2;
  }
}
