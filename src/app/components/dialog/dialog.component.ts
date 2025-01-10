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
  private _dialogData?: any;
  @Input()
  set dialogData(value: any) {
    if (this._dialogData !== value) {
      this._dialogData = value;
      this.updateDialogContentInjector();
    }
  }
  private _showing: boolean = false;
  @Output() showingChange = new EventEmitter<boolean>();
  @Input()
  get showing(): boolean {
    return this._showing;
  }
  set showing(value: boolean) {
    this._showing = value;
    value ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll');
    this.showingChange.emit(this._showing);
  }
  injector: Injector = inject(Injector);
  dialogContentInjector?: Injector;
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


  private updateDialogContentInjector(): void {
    if (this._dialogData) {
      this.dialogContentInjector = Injector.create({
        providers: [{ provide: 'DIALOG_DATA', useValue: this._dialogData }],
        parent: this.injector,
      });
    } else {
      this.dialogContentInjector = undefined;
    }
  }
}
