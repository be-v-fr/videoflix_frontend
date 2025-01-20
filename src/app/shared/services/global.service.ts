import { Injectable } from '@angular/core';


/**
 * This injectable contains properties with global relevance, i.e. relevance across the whole application.
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  userClickedDuringVisit: boolean = false;
}
