import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthService } from './shared/services/auth.service';
import { ToastNotificationComponent } from './shared/components/toast-notification/toast-notification.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, ToastNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  navigationEndSub: Subscription = new Subscription();
  title = 'videoflix_frontend';
  navMode?: 'login' | 'signup' | 'home' | 'back';
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
    if (!this.authService.currentUser) {
      this.initAuth();
    }
    this.setNavMode();
  }


  initAuth() {
    localStorage.getItem('token') ? this.handleToken() : this.redirectToLogin();
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
    if (!this.isOnAuthRoute()) {
      this.router.navigateByUrl('auth/login');
    }
  }


  onAuthError(err: any) {
    if (!this.isOnAuthRoute()) {
      this.toastErrorMsg = (err == this.authService.getTimeoutErrorMsg()) ? 'Server does not respond.' : 'Authentication failed.';
    }
  }


  setNavMode() {
    const urlSegments: string[] = this.router.url.split('/');
    switch(urlSegments[1]) {
      case 'auth': this.navMode = urlSegments.includes('login') ? 'signup' : 'login'; break;
      case 'legal': this.navMode = 'back'; break;
      default: this.navMode = 'home';
    }
  }
}
