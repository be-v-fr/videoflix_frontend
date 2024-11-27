import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss'
})
export class FormErrorComponent {
  @Input() conditions: (boolean | null)[] = [];
  @Input() messages: string[] = [];

  get firstError(): string | null {
    if (this.conditions.length !== this.messages.length) {
      console.error('Conditions and Messages arrays must have the same length.');
      return null;
    }
    const errorIndex = this.conditions.findIndex(condition => condition === true);
    return errorIndex !== -1 ? this.messages[errorIndex] : null;
  }
}
