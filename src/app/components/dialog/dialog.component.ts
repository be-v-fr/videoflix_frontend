import { CommonModule } from '@angular/common';
import { Component, Type, Input, Output, EventEmitter, Injector, inject } from '@angular/core';


/**
 * A reusable animated dialog container component for displaying dynamic content.
 * Provides functionality for managing dialog state and passing data to the dialog content.
 */
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  
  /**
   * The dialog content component to be displayed inside the dialog container.
   * This must be a dynamically loaded Angular component.
   */
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


  /**
   * Opens the dialog.
   */
  open() {
    this.showing = true;
  }

  
  /**
   * Closes the dialog with a sliding-out animation.
   */
  close() {
    console.log('close!');
    this.slidingOut = true;
    setTimeout(() => {
      this.showing = false;
      this.slidingOut = false;
    }, 250);
  }


  /**
   * Updates the "dialogContentInjector" with the latest "dialogData".
   * Creates a new injector with the "DIALOG_DATA" token if data is provided.
   */
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
