import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../../shared/components/search/search.component';

@Component({
  selector: 'app-nav-search',
  standalone: true,
  imports: [CommonModule, SearchComponent],
  templateUrl: './nav-search.component.html',
  styleUrl: './nav-search.component.scss'
})
export class NavSearchComponent {
  showOnMobile: boolean = false;

  toggleMobileOverlay(): void {
    this.showOnMobile = !this.showOnMobile;
  }
}
