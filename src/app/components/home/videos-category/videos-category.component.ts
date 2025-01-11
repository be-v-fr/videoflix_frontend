import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VideoMeta } from '../../../shared/models/video-meta';
import { VideoCompletion } from '../../../shared/models/video-completion';
import { VideoCardComponent } from '../video-card/video-card.component';
import { CommonModule } from '@angular/common';
import { StyleService } from '../../../shared/services/style.service';

@Component({
  selector: 'app-videos-category',
  standalone: true,
  imports: [CommonModule, VideoCardComponent],
  templateUrl: './videos-category.component.html',
  styleUrl: './videos-category.component.scss'
})
export class VideosCategoryComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) selection!: VideoMeta[];
  @Input({ required: true }) categoryIndex!: number;
  @Output() continue: EventEmitter<{ meta: VideoMeta, completion: VideoCompletion }> = new EventEmitter();
  @Output() details: EventEmitter<{ meta: VideoMeta, completion?: VideoCompletion }> = new EventEmitter();


  constructor(
    public styleService: StyleService
  ) { }
}