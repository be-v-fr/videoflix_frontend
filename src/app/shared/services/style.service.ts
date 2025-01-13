import { Injectable } from '@angular/core';


/**
 * Service for communicating style information across components.
 */
@Injectable({
  providedIn: 'root'
})
export class StyleService {
  lastVideoCategoryHovered: number = -1;
}
