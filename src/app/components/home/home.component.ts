import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoInfo } from '../../shared/models/video-info';
import { VideoCardComponent } from './video-card/video-card.component';
import { LoadingCircleComponent } from '../../shared/components/loading-circle/loading-circle.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, VideoCardComponent, LoadingCircleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // videosInfo?: VideoInfo[];
  videosInfo: VideoInfo[] = [
    new VideoInfo({title: 'test one', duration_in_minutes: 20}),
    new VideoInfo({title: 'test two', duration_in_minutes: 20}),
  ];
}
