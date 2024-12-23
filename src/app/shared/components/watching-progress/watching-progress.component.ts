import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoCompletion } from '../../models/video-completion';
import { VideoMeta } from '../../models/video-meta';

@Component({
  selector: 'app-watching-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watching-progress.component.html',
  styleUrl: './watching-progress.component.scss'
})
export class WatchingProgressComponent implements OnInit {
  @Input({ required: true }) metaData!: VideoMeta;
  @Input({ required: true }) completion!: VideoCompletion;
  width?: string;
  text?: string;


  ngOnInit(): void {
    this.width = this.calcProgressWidth();
    this.text = this.generateProgressText();
  }


  calcProgressWidth(): string {
    const relativeProgress: number = this.completion.currentTime / this.metaData.durationInSeconds;
    return relativeProgress * 100 + '%';
  }


  generateProgressText(): string {
    const durScnds: number = Math.round(this.metaData.durationInSeconds);
    if (this.completion.currentTime == -1 || this.metaData.durationInSeconds == -1) {
      return 'Unknown progress';
    } else {
      return durScnds < 60 ? this.generateProgInSeconds() : this.generateProgInMinutes();
    }
  }


  generateProgInSeconds(): string {
    return `${Math.floor(this.completion.currentTime)} of ${Math.round(this.metaData.durationInSeconds)} s`;
  }


  generateProgInMinutes(): string {
    let progressMinutes: number = Math.floor(this.completion.currentTime / 60);
    let durationMinutes: number = Math.round(this.metaData.durationInSeconds / 60);
    let value = `${progressMinutes} of ${durationMinutes}`;
    return durationMinutes > 1 ? value + ' mins.' : value + ' min.';
  }
}