import { Component, Input } from '@angular/core';


/**
 * Simple email anchor element.
 */
@Component({
  selector: 'app-email',
  standalone: true,
  imports: [],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})
export class EmailComponent {
  @Input({ required: true }) email!: string;
}
