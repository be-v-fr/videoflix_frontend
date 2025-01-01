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

  /** Event triggered after toast notification has expired */
  @Output() then = new EventEmitter<void>;

  /** Toast notification display state, synced in real time with input variable */
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
   */
  onShow() {
    const timeoutLength = (this.status == 'error') ? 5000 : 2000;
    setTimeout(() => this.close(), timeoutLength);
  }


  close() {
    if (this._showing) {
      this._showing = false;
      this.then.emit();
    }
  }
}
