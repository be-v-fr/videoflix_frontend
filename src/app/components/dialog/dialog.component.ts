import { CommonModule } from '@angular/common';
import { Component, Type, Input, Output, EventEmitter, Injector, inject } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input({alias: 'dialog', required: true}) dialogContent!: Type<object>;
  @Input() dialogData?: any;
  injector: Injector = inject(Injector);

  private _showing: boolean = false;
  @Output() showingChange = new EventEmitter<boolean>();
  @Input()
  get showing(): boolean {
    return this._showing;
  }
  set showing(value: boolean) {
    this._showing = value;
    this.showingChange.emit(this._showing);
  }
  public slidingOut: boolean = false;

  open() {
    this.showing = true;
  }

  // timeout length identical to "$slide-duration" in style file
  close() {
    this.slidingOut = true;
    setTimeout(() => {
      this.showing = false;
      this.slidingOut = false;
    }, 250);
  }


  get dialogContentInjector(): Injector | undefined {
    if (!this.dialogData) {
      return undefined;
    }
    return Injector.create({
      providers: [
        { provide: 'DIALOG_DATA', useValue: this.dialogData }
      ],
      parent: this.injector
    });
  }
}
