import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';


/**
 * "Videoflix" logo including a "condensed" option to only display the letter "V".
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  @Input() condensed: boolean = false;
}
