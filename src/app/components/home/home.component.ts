import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { VideoCardComponent } from './video-card/video-card.component';
import { LoadingCircleComponent } from '../../shared/components/loading-circle/loading-circle.component';
import { VideosService } from '../../shared/services/videos.service';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavigationComponent, VideoCardComponent, LoadingCircleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  authSub: Subscription = new Subscription();


  constructor(
    private authService: AuthService,
    public videosService: VideosService,
  ) { }


  ngOnInit(): void {
    if(this.authService.currentUser) {
      this.videosService.syncVideosMetaIfAllowed();
    }
    this.authSub = this.subAuth();
  }


  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


  subAuth(): Subscription {
    return this.authService.currentUser$.subscribe(user => {
      if(user) {
        this.videosService.syncVideosMetaIfAllowed();
      }
    });
  }
}
