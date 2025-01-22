import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { VideoMeta } from '../../../shared/models/video-meta';
import { VideoCompletion } from '../../../shared/models/video-completion';
import { VideoCardComponent } from '../video-card/video-card.component';
import { CommonModule } from '@angular/common';
import { StyleService } from '../../../shared/services/style.service';


/**
 * Component for displaying a category of videos in a grid format.
 * Allows expansion and adapts its layout based on screen size.
 */
@Component({
  selector: 'app-videos-category',
  standalone: true,
  imports: [CommonModule, VideoCardComponent],
  templateUrl: './videos-category.component.html',
  styleUrl: './videos-category.component.scss'
})
export class VideosCategoryComponent implements AfterViewInit {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) selection!: VideoMeta[];
  @Input({ required: true }) categoryIndex!: number;
  @Output() continue: EventEmitter<{ meta: VideoMeta, completion: VideoCompletion }> = new EventEmitter();
  @Output() details: EventEmitter<{ meta: VideoMeta, completion?: VideoCompletion }> = new EventEmitter();
  expanded: boolean = false;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  moreThanOneRow: boolean = true;
  private lastWindowEventHandling = 0;
  private onWindowEventThrottleInterval = 100;
  rowLayout: boolean = false;


  constructor(
    public styleService: StyleService
  ) { }


  /**
   * Checks whether the video cards span multiple rows.
   */
  ngAfterViewInit(): void {
    this.checkRows();
  }


  /**
   * Toggles the expansion state of the component instance.
   */
  toggleExpansion(): void {
    this.expanded = !this.expanded;
  }


  /**
   * Handles window resize events and rechecks the layout if the event throttling condition is met.
   */
  @HostListener('window:resize')
  onResize() {
    const now = Date.now();
    if (now - this.lastWindowEventHandling >= this.onWindowEventThrottleInterval) {
      this.lastWindowEventHandling = now;
      this.checkLayout();
      this.checkRows();
    }
  }


  /**
   * Adjusts layout to the current viewport dimensions.
   */
  checkLayout(): void {
    this.rowLayout = window.innerWidth <= 800;
  }


  /**
   * Checks whether the video cards span multiple rows based on their layout.
   */
  checkRows(): void {
    if (this.selection.length > 0 && !this.rowLayout) {
      const children = Array.from(this.containerRef.nativeElement.children) as HTMLElement[];
      if (children.length === this.selection.length) {
        this.checkVerticalSize(children);
      } else {
        this.checkHorizontalSize(children);
      }
    }
  }


  /**
   * Checks the vertical size of the video cards to determine if they span multiple rows.
   * @param {HTMLElement[]} children Array of child elements (video cards) in the container.
   */
  checkVerticalSize(children: HTMLElement[]): void {
    const containerHeight: number = this.containerRef.nativeElement.offsetHeight;
    const videoHeight: number = children[0].offsetHeight;
    this.moreThanOneRow = containerHeight > 2 * videoHeight;
  }


  /**
   * Checks the horizontal size of the video cards to determine if they span multiple rows.
   * @param {HTMLElement[]} children Array of child elements (video cards) in the container.
   */
  checkHorizontalSize(children: HTMLElement[]): void {
    const containerWidth: number = this.containerRef.nativeElement.offsetWidth;
    const videoWidth: number = children[0].offsetWidth;
    const videoGap: number = children[1].offsetLeft - children[0].offsetLeft - videoWidth;
    this.moreThanOneRow = containerWidth + videoGap < this.selection.length * (videoWidth + videoGap);
  }
}