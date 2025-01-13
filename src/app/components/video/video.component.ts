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


/**
 * Component for displaying a video player with metadata and handling related
 * logic such as user authentication, metadata synchronization, and error handling.
 */
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


  /**
   * Initializes the component and sets up authentication and video metadata.
   */
  ngOnInit(): void {
    if(this.authService.currentUser) {
      this.initVideo();
    }
    this.authSub = this.subAuth();
  }


  /**
   * Cleans up resources when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


  /**
   * Subscribes to authentication state changes.
   */
  subAuth(): Subscription {
    return this.authService.currentUser$.subscribe(user => {
      if(user) {
        this.initVideo();
      }
    });
  }


  /**
   * Initializes video metadata by retrieving the video ID from the route
   * and fetching metadata from the service if necessary.
   */
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


  /**
   * Synchronizes video metadata by retrieving it from the server.
   * @param {number} id The ID of the video.
   */
  syncVideoMeta(id: number) {
    this.videosService.retrieveVideoMeta(id)
      .then(resp => this.metaData = new VideoMeta(resp))
      .catch(err => this.onError(err));
  }


  /**
   * Handles errors by formatting the error message and updating the toast notification.
   * @param {any} err The error response to handle.
   */
  onError(err: any) {
    const resp: Record<string, string[]> = this.errorService.generateErrRecord(err);
    this.toastErrorMsg = ('detail' in resp) ? resp['detail'][0] : resp['unknown'][0];
  }
}