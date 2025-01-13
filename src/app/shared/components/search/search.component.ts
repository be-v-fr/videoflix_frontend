import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
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
export class SearchComponent {
  @ViewChild('searchInputElement') searchInputRef!: ElementRef<HTMLInputElement>;


  constructor(
    public videosService: VideosService
  ) { }


  /**
   * Focuses input field.
   */
  focus() {
    this.searchInputRef.nativeElement.focus();
  }


  /**
   * Resets input field.
   */
  clear(): void {
    this.videosService.searchFilter = '';
    this.focus();
  }
}
