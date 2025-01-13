import { Component, OnInit, OnDestroy, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingCircleComponent } from '../../shared/components/loading-circle/loading-circle.component';
import { VideosService } from '../../shared/services/videos.service';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { DialogContinueWatchingComponent } from '../../shared/components/dialog-continue-watching/dialog-continue-watching.component';
import { DialogComponent } from '../dialog/dialog.component';
import { VideoMeta } from '../../shared/models/video-meta';
import { VideoCompletion } from '../../shared/models/video-completion';
import { VideosCategoryComponent } from './videos-category/videos-category.component';
import { VideoPreviewComponent } from '../video-preview/video-preview.component';
import { DialogVideoDetailsComponent } from '../../shared/components/dialog-video-details/dialog-video-details.component';


/**
 * Dashboard including
 * - a viewport-sized video preview
 * - video cards sorted by categories, including genres
 * - interactive dialogs regarding video details and playback states.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, VideoPreviewComponent, VideosCategoryComponent, LoadingCircleComponent, DialogComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  authSub: Subscription = new Subscription();
  continueWatchingComponent: Type<object> = DialogContinueWatchingComponent;
  videoDetailsComponent: Type<object> = DialogVideoDetailsComponent;
  showingContinueWatchingDialog: boolean = false;
  showingVideoDetailsDialog: boolean = false;
  continueWatchingData?: { meta: VideoMeta, completion: VideoCompletion };
  videoDetailsData?: { meta: VideoMeta, completion?: VideoCompletion };


  constructor(
    private authService: AuthService,
    public videosService: VideosService,
  ) { }


  /**
   * Initializes the component by syncing video metadata and initializing user-related data.
   * */
  ngOnInit(): void {
    if (this.authService.currentUser) {
      this.initAppContent();
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
   * Initializes the application content by syncing video metadata
   * and initializing video completion data.
   * @returns {Promise<void>} Resolves when initialization is complete.
   */
  async initAppContent(): Promise<void> {
    await this.videosService.syncVideosMetaIfAllowed();
    this.videosService.initVideoCompletionData();
  }


  /**
   * Subscribes to authentication state changes and re-initializes app content when the user logs in.
   */
  subAuth(): Subscription {
    return this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.initAppContent();
      }
    });
  }


  /**
   * Displays the continue watching dialog with the provided video metadata and completion data.
   */
  continueVideo(data: { meta: VideoMeta, completion: VideoCompletion }): void {
    if (this.continueWatchingData !== data) {
      this.continueWatchingData = data;
    }
    this.showingContinueWatchingDialog = true;
  }


  /**
   * Displays the video details dialog with the provided video metadata and optional completion data.
   */
  showVideoDetails(data: { meta: VideoMeta, completion?: VideoCompletion }): void {
    if (this.continueWatchingData !== data) {
      this.videoDetailsData = data;
    }
    this.showingVideoDetailsDialog = true;
  }
}
