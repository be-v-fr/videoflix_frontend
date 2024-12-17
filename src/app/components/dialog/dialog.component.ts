import { CommonModule } from '@angular/common';
import { Component, Type, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input({alias: 'dialog', required: true}) dialogContent!: Type<object>;

  private _showing = false;
  @Output() showingChange = new EventEmitter<boolean>();
  @Input()
  get showing(): boolean {
    return this._showing;
  }
  set showing(value: boolean) {
    this._showing = value;
    this.showingChange.emit(this._showing);
  }

  open() {
    this.showing = true;
  }

  close() {
    this.showing = false;
  }
}
