import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


/**
 * Password input icon designed to respond dynamically to the current input value
 * and to toggle the input visibility options when clicked.
 * 
 * The corresponding HTML input element is directly passed to any component instance.
 * Thus, no output to the parent component is needed.
 */
@Component({
  selector: 'app-dynamic-pw-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-pw-icon.component.html',
  styleUrl: './dynamic-pw-icon.component.scss'
})
export class DynamicPwIconComponent {
  @Input({ alias: 'inputElement', required: true }) element!: HTMLInputElement;


  /**
   * Toggles password input visibility by toggling between "password" and "text" input type.
   */
  toggleType(): void {
    this.element.type = (this.element.type === 'password') ? 'text' : 'password';
    this.element.focus();
  }
}