import { EventEmitter, Injectable, Type } from '@angular/core';


/**
 * Service to handles dialog actions, taking into account that some dialogs are
 * injected as abstract components into the general dialog (container) component.
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {
  closeEvent = new EventEmitter<{ component: Type<object> }>();


  /**
   * Closes opened dialogs of the specified type.
   * @param {Type<object>} component Dialog class. 
   */
  close(component: Type<object>) {
    this.closeEvent.emit({ component });
  }
}
