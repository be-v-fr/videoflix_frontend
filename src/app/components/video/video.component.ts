import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoMeta } from '../../shared/models/video-meta';
import { ActivatedRoute } from '@angular/router';
import { VideosService } from '../../shared/services/videos.service';
import { PlayerComponent } from './player/player.component';
import { LoadingCircleComponent } from '../../shared/components/loading-circle/loading-circle.component';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule, PlayerComponent, LoadingCircleComponent],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent implements OnInit {
  metaData?: VideoMeta;


  constructor(
    private route: ActivatedRoute,
    private videosService: VideosService,
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const videoId = paramMap.get('id');
      console.log('video id:', videoId);
      if (videoId) {
        this.metaData = this.videosService.getVideoMetaFromId(+videoId);
        if (!this.metaData) {
          console.error('Video not found!');
          // show not found error
        }
      }
    });
  }
}
