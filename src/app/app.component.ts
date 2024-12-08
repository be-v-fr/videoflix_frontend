import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { VideosService } from './shared/services/videos.service';
import { AuthService } from './shared/services/auth.service';
import { ToastNotificationComponent } from './shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'videoflix_frontend';
  toastMsg: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private videosService: VideosService,
  ) { }


  ngOnInit(): void {
    localStorage.getItem('token') ? this.handleToken() : this.redirectToLogin();
  }


  handleToken() {
    this.authService.authenticateToken()
      .then(resp => this.authService.triggerUser(resp))
      .catch(err => this.onAuthError(err));  
  }


  isOnAuthRoute(): boolean {
    return this.router.url.includes('auth');
  }


  redirectToLogin() {
    if(!this.isOnAuthRoute()) {
      this.router.navigateByUrl('auth/login');
    }
  }


  onAuthError(err: any) {
    if(!this.isOnAuthRoute()) {
      this.toastMsg = (err == this.authService.getTimeoutErrorMsg()) ? 'Server does not respond.' : 'Authentication failed.';
    }
  }
}
