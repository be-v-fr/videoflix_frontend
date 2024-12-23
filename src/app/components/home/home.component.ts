import { Component, OnInit, OnDestroy, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { VideoCardComponent } from './video-card/video-card.component';
import { LoadingCircleComponent } from '../../shared/components/loading-circle/loading-circle.component';
import { VideosService } from '../../shared/services/videos.service';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { DialogContinueWatchingComponent } from '../../shared/components/dialog-continue-watching/dialog-continue-watching.component';
import { DialogComponent } from '../dialog/dialog.component';
import { VideoMeta } from '../../shared/models/video-meta';
import { VideoCompletion } from '../../shared/models/video-completion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavigationComponent, VideoCardComponent, LoadingCircleComponent, DialogComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  authSub: Subscription = new Subscription();
  continueWatchingComponent: Type<object> = DialogContinueWatchingComponent;
  showingContinueWatchingDialog: boolean = false;
  continueWatchingData?: {meta: VideoMeta, completion: VideoCompletion};


  constructor(
    private authService: AuthService,
    public videosService: VideosService,
  ) { }


  ngOnInit(): void {
    if (this.authService.currentUser) {
      this.initAppContent();
    }
    this.authSub = this.subAuth();
  }


  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


  async initAppContent(): Promise<void> {
    await this.videosService.syncVideosMetaIfAllowed();
    this.videosService.initVideoCompletionData();
  }


  subAuth(): Subscription {
    return this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.initAppContent();
      }
    });
  }


  continueVideo(data: { meta: VideoMeta, completion: VideoCompletion }) {
    this.continueWatchingData = data;
    this.showingContinueWatchingDialog = true;
    console.log(this.continueWatchingData);
  }
}
