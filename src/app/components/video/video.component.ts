import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoMeta } from '../../shared/models/video-meta';
import { ActivatedRoute } from '@angular/router';
import { VideosService } from '../../shared/services/videos.service';
import { PlayerComponent } from './player/player.component';
import { LoadingCircleComponent } from '../../shared/components/loading-circle/loading-circle.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule, PlayerComponent, LoadingCircleComponent],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent implements OnInit, OnDestroy {
  authSub: Subscription = new Subscription();
  metaData?: VideoMeta;


  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private videosService: VideosService,
  ) { }


  ngOnInit(): void {
    this.authSub = this.subAuth();
  }


  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


  subAuth(): Subscription {
    return this.authService.currentUser$.subscribe(user => {
      if(user) {
        this.initVideo();
      }
    });
  }


  initVideo() {
    this.route.paramMap.subscribe(paramMap => {
      const videoId = paramMap.get('id');
      if (videoId) {
        this.metaData = this.videosService.getVideoMetaFromId(+videoId);
        if (!this.metaData) {
          this.syncVideoMeta(+videoId);
        }
      }
    });
  }


  syncVideoMeta(id: number) {
    this.videosService.retrieveVideoMeta(id)
      .then(resp => this.metaData = new VideoMeta(resp))
      .catch(err => this.onError(err));
  }


  onError(err: any) {
    // error handling logic
    console.error('Video not found!');
  }
}
