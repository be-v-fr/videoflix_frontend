import { Component, Input } from '@angular/core';
import { VideoInfo } from '../../../models/video-info';
import { LoadingCircleComponent } from '../../../shared/components/loading-circle/loading-circle.component';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [LoadingCircleComponent],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss'
})
export class VideoCardComponent {
  @Input() info?: VideoInfo;
}