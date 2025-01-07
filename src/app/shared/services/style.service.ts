import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  lastVideoCategoryHovered: number = -1;
}
