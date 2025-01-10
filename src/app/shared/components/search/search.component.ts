import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { VideosService } from '../../services/videos.service';

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

  focus() {
    this.searchInputRef.nativeElement.focus();
  }

  clear(): void {
    this.videosService.searchFilter = '';
    this.focus();
  }
}
