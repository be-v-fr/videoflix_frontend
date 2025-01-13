import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';


/**
 * Base component serving as a container for every component related to user authentication.
 */
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {


  constructor(
    public router: Router
  ) { }
}
