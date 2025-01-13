import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


/**
 * Custom checkbox with the check state as input parameter.
 * This component itself is purely "cosmetic":
 * It is designed to be shown under a transparent default HTML checkbox. 
 */
@Component({
  selector: 'app-custom-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-checkbox.component.html',
  styleUrl: './custom-checkbox.component.scss'
})
export class CustomCheckboxComponent {
  @Input({ required: true }) checked!: boolean;
}
