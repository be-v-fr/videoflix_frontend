import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-pw-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-pw-icon.component.html',
  styleUrl: './dynamic-pw-icon.component.scss'
})
export class DynamicPwIconComponent {
  @Input({ alias: 'inputElement', required: true }) element!: HTMLInputElement;

  toggleType(): void {
    this.element.type = (this.element.type === 'password') ? 'text' : 'password';
    this.element.focus();
  }
}