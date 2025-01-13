import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


/**
 * Simple footer including links to privacy policy and imprint.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
