import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';


/**
 * Parent component for password reset activities.
 */
@Component({
  selector: 'app-pw-reset',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './pw-reset.component.html',
  styleUrl: './pw-reset.component.scss'
})
export class PwResetComponent {


  constructor(
    public authService: AuthService,
  ) {}
}
