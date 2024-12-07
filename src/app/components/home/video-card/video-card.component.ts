import { Component, Input } from '@angular/core';
import { LoadingCircleComponent } from '../../../shared/components/loading-circle/loading-circle.component';
import { VideoMeta } from '../../../shared/models/video-meta';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [LoadingCircleComponent],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.scss'
})
export class VideoCardComponent {
  @Input() data?: VideoMeta;
}