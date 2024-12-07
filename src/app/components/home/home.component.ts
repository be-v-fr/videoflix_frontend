import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoCardComponent } from './video-card/video-card.component';
import { LoadingCircleComponent } from '../../shared/components/loading-circle/loading-circle.component';
import { VideosService } from '../../shared/services/videos.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, VideoCardComponent, LoadingCircleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    public videosService: VideosService,
  ) { }
}
