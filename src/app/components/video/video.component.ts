import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoMeta } from '../../shared/models/video-meta';
import { ActivatedRoute, Router } from '@angular/router';
import { VideosService } from '../../shared/services/videos.service';
import { PlayerComponent } from './player/player.component';
import { LoadingCircleComponent } from '../../shared/components/loading-circle/loading-circle.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { ErrorService } from '../../shared/services/error.service';
import { ToastNotificationComponent } from '../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule, PlayerComponent, LoadingCircleComponent, ToastNotificationComponent],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent implements OnInit, OnDestroy {
  authSub: Subscription = new Subscription();
  metaData?: VideoMeta;
  toastErrorMsg: string = '';


  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService,
    private videosService: VideosService,
    private errorService: ErrorService,
  ) { }


  ngOnInit(): void {
    if(this.authService.currentUser) {
      this.initVideo();
    }
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
    const resp: Record<string, string[]> = this.errorService.generateErrorResp(err);
    this.toastErrorMsg = ('detail' in resp) ? resp['detail'][0] : resp['unknown'][0];
  }
}