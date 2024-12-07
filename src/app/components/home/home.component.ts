import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoCardComponent } from './video-card/video-card.component';
import { LoadingCircleComponent } from '../../shared/components/loading-circle/loading-circle.component';
import { VideoMeta } from '../../shared/models/video-meta';
import { VideosService } from '../../shared/services/videos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, VideoCardComponent, LoadingCircleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(
    public videoService: VideosService,
  ) { }

  ngOnInit(): void {
    console.log('init home...');
    // try catch
    this.videoService.syncVideosMeta();
  }
}
