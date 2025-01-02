import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @ViewChild('searchInputElement') searchInputRef!: ElementRef<HTMLInputElement>;
  searchFilter: string = '';

  focus() {
    this.searchInputRef.nativeElement.focus();
  }

  clear(): void {
    this.searchFilter = '';
    this.focus();
  }
}
