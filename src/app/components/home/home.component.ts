import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoCardComponent } from './video-card/video-card.component';
import { LoadingCircleComponent } from '../../shared/components/loading-circle/loading-circle.component';
import { VideoMeta } from '../../shared/models/video-meta';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, VideoCardComponent, LoadingCircleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // videosMeta?: VideoMeta[];
  videosMeta: VideoMeta[] = [
    new VideoMeta({title: 'test one', description: 'description one', duration_in_minutes: 20}),
    new VideoMeta({title: 'test two', description: 'description two', duration_in_minutes: 20}),
  ];
}
