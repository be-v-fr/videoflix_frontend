import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
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
export class VideosCategoryComponent implements OnInit {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) selection!: VideoMeta[];
  @Input({ required: true }) categoryIndex!: number;
  @Output() continue: EventEmitter<{ meta: VideoMeta, completion: VideoCompletion }> = new EventEmitter();
  @Output() details: EventEmitter<{ meta: VideoMeta, completion?: VideoCompletion }> = new EventEmitter();
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  verticalPositionInViewport: 'center' | 'top' | 'bottom' = 'center';
  private lastWindowEventHandling = 0;
  private onWindowEventThrottleInterval = 50;


  constructor(
    public styleService: StyleService
  ) { }


  ngOnInit(): void {
    this.checkViewport();
  }


  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])
  onWindowEvent() {
    const now = Date.now();
    if (now - this.lastWindowEventHandling >= this.onWindowEventThrottleInterval) {
      this.lastWindowEventHandling = now;
      this.checkViewport();
    }
  }


  checkViewport() {
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    this.verticalPositionInViewport = this.calculateVerticalPosition(rect);
  }

  
  calculateVerticalPosition(rect: DOMRect): 'center' | 'top' | 'bottom' {
    const elementHeight = rect.bottom - rect.top;
    if(rect.top - elementHeight < 0) {
      return 'top';
    } else if(rect.bottom + elementHeight > window.innerHeight) {
      return 'bottom';
    } else {
      return 'center';
    }
  } 
}
