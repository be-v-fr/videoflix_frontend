import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, Output, EventEmitter, Input, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VideosService } from '../../services/videos.service';


/**
 * Search bar connected to the "searchFilter" property from the "VideosService" injectable.
 */
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('searchInputElement') searchInputRef!: ElementRef<HTMLInputElement>;
  @Input() autofocus: boolean = false;
  @Input() addClosingToClearBtn: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();


  constructor(
    public videosService: VideosService
  ) { }


  /**
   * Executes autofocus.
   */
  ngAfterViewInit(): void {
    if(this.autofocus) {
      this.focus();
    }
  }


  /**
   * Focuses input field.
   */
  focus() {
    this.searchInputRef.nativeElement.focus();
  }


  /**
   * Resets input field.
   */
  handleClearBtn(): void {
    if(this.videosService.searchFilter.length > 0) {
      this.videosService.searchFilter = '';
      this.focus();
    } else if(this.addClosingToClearBtn) {
      this.close.emit();
    }
  }


  /**
   * Resets input field.
   */
  clear(): void {
    this.videosService.searchFilter = '';
    this.focus();
  }
}
