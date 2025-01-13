import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConditionalErrorMsg } from '../../interfaces/conditional-error-msg';


/**
 * Dynamic form error component.
 * 
 * Receives an array of conditional error messages as inputs. Displays the first error message
 * from that array whose condition is fulfilled. 
 */
@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss'
})
export class FormErrorComponent {
  @Input() errors: ConditionalErrorMsg[] = [];

  get firstError(): string | null {
    const errorIndex = this.errors.findIndex(e => e.condition === true);
    return errorIndex !== -1 ? this.errors[errorIndex].msg : null;
  }
}
