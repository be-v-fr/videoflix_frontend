import { Component, Input } from '@angular/core';
import { VideoMeta } from '../../models/video-meta';

@Component({
  selector: 'app-duration',
  standalone: true,
  imports: [],
  templateUrl: './duration.component.html',
  styleUrl: './duration.component.scss'
})
export class DurationComponent {
  @Input({ required: true }) metaData!: VideoMeta;
}
