import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.scss'
})
export class ToastNotificationComponent {
  @Input() status: 'ok' | 'error' | 'neutral' = 'ok';
  @Input({ required: true }) msg!: string;
  @Output() then = new EventEmitter<void>;
  private _showing: boolean = false;
  @Input({ alias: 'show' })
  set showing(value: boolean) {
    if (value) {
      this._showing = true;
      this.onShow();
    }
  };
  get showing(): boolean {
    return this._showing;
  }


  /**
   * Triggered after the "showing" property has been set to true.
   * Sets timeout to close the notification later on.
   */
  onShow() {
    const timeoutLength = (this.status == 'error') ? 5000 : 2000;
    setTimeout(() => this.close(), timeoutLength);
  }


  /**
   * Closes the notification, triggering the "then" event to apply
   * subsequent logic in the parent component.
   */
  close() {
    if (this._showing) {
      this._showing = false;
      this.then.emit();
    }
  }
}
