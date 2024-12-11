import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { VideosService } from './shared/services/videos.service';
import { AuthService } from './shared/services/auth.service';
import { ToastNotificationComponent } from './shared/components/toast-notification/toast-notification.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  navigationEndSub: Subscription = new Subscription();
  title = 'videoflix_frontend';
  toastErrorMsg: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.navigationEndSub = this.subNavigationEnd();
  }


  ngOnDestroy(): void {
    this.navigationEndSub.unsubscribe();
  }


  subNavigationEnd(): Subscription {
    return this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => this.onNavigationEnd());
  }


  onNavigationEnd() {
    localStorage.getItem('token') ? this.handleToken() : this.redirectToLogin();
    this.navigationEndSub.unsubscribe();    
  }


  handleToken() {
    this.authService.authenticateToken()
      .then(resp => this.authService.triggerUser(resp))
      .catch(err => this.onAuthError(err));  
  }


  isOnAuthRoute(): boolean {
    return this.router.url.slice(0, 6) === '/auth/';
  }


  redirectToLogin() {
    if(!this.isOnAuthRoute()) {
      this.router.navigateByUrl('auth/login');
    }
  }


  onAuthError(err: any) {
    if(!this.isOnAuthRoute()) {
      this.toastErrorMsg = (err == this.authService.getTimeoutErrorMsg()) ? 'Server does not respond.' : 'Authentication failed.';
    }
  }
}
