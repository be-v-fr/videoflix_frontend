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
  videosPerRow: number = 100;
  containerOverflows: boolean = false;
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
    this.updateLayout();
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
      this.updateLayout();
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
      this.updateVideosPerRow(children);
      if (children.length === this.selection.length) {
        this.checkVerticalSize(children);
      } else {
        this.checkHorizontalSize();
      }
    }
  }


  /**
   * Calculates the integer number of video cards per row.
   * @param {HTMLElement[]} children Array of child elements (video cards) in the container.
   */
  updateVideosPerRow(children: HTMLElement[]): void {
    if (children.length > 1) {
      const containerWidth: number = this.containerRef.nativeElement.offsetWidth;
      const videoWidth: number = children[0].offsetWidth;
      const videoGap: number = children[1].offsetLeft - children[0].offsetLeft - videoWidth;
      this.videosPerRow = Math.floor((containerWidth + videoGap) / (videoWidth + videoGap));
    } else {
      this.videosPerRow = 1;
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
   */
  checkHorizontalSize(): void {
    this.moreThanOneRow = this.videosPerRow < this.selection.length;
  }


  /**
   * Checks if the videos container overflows and updates the `containerOverflows` property accordingly.
   */
  checkOverflow(): void {
    if (this.rowLayout) {
      const container: HTMLDivElement | undefined = this.containerRef.nativeElement;
      if (container) {
        this.containerOverflows = container.clientWidth < container.scrollWidth;
      }
    }
  }


  /**
   * Dynamically updates the layout to match the viewport based on the component's content.
   * Takes into account large as well as small screens.
   */
  updateLayout(): void {
    this.checkLayout();
    this.checkRows();
    this.checkOverflow();
  }


  /**
   * Scrolls the videos container content along the x-axis.
   * @param direction Scrolling direction.
   */
  scroll(direction: 'left' | 'right'): void {
    let scrollValue: number = 187;
    if (direction === 'left') {
      scrollValue *= -1;
    }
    this.containerRef.nativeElement.scrollBy(scrollValue, 0);
  }
}