import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './shared/services/auth.service';
import { ToastNotificationComponent } from './shared/components/toast-notification/toast-notification.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationComponent, FooterComponent, ToastNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  navigationEndSub: Subscription = new Subscription();
  title = 'videoflix_frontend';
  navMode?: 'login' | 'home' | 'back';
  toastErrorMsg: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }


  /**
   * Subscribes to router events to initialize navigation handling.
   */
  ngOnInit(): void {
    this.navigationEndSub = this.subNavigationEnd();
  }


  /**
   * Unsubscribes subscriptions.
   */
  ngOnDestroy(): void {
    this.navigationEndSub.unsubscribe();
  }


  /**
   * Subscribes to the NavigationEnd event of the router.
   * @returns {Subscription} A Subscription object for managing the subscription.
   */
  subNavigationEnd(): Subscription {
    return this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.onNavigationEnd());
  }


  /**
   * Called after a navigation event, handles authentication and navigation tasks.
   */
  onNavigationEnd() {
    if (!this.authService.currentUser) {
      this.initAuth();
    }
    this.navMode = this.getNavMode();
    if(this.isOnMainRoute(['legal'])) {
      window.scrollTo(0, 0);
    }
  }


  /**
   * Initializes authentication based on local storage data.
   */
  initAuth() {
    (localStorage.getItem('rememberMe') === 'true') && localStorage.getItem('token') ? this.handleToken() : this.redirect();
  }


  /**
   * Handles the token for authentication and triggers user login.
   */
  handleToken() {
    this.authService.authenticateToken()
      .then(resp => this.authService.triggerUser(resp))
      .catch(err => this.onAuthError(err));
  }


  /**
   * Returns the first route segment of the current URL.
   */
  getFirstRouteSegment() {
    return this.router.url.split('/')[1]
  }


  /**
   * Checks if the first URL segment matches any of the provided segments.
   */
  isOnMainRoute(firstSegments: string[]): boolean {
    return firstSegments.includes(this.getFirstRouteSegment());
  }


  /**
   * Checks if the first URL segment is empty.
   */
  isOnEmptyRoute(): boolean {
    return this.getFirstRouteSegment().length === 0;
  }


  /**
   * Checks if the current route is a protected route.
   */
  isOnProtectedRoute(): boolean {
    return !this.isOnMainRoute(['welcome', 'auth', 'legal']);
  }


  /**
   * Redirects to welcome route if the current route is empty, else to login.
   */
  redirect() {
    if(this.isOnEmptyRoute()) {
      this.router.navigateByUrl('welcome');
    } else {
      this.redirectToLogin();
    }
  }


  /**
   * Redirects to login if the current route is a protected route.
   */
  redirectToLogin() {
    if (this.isOnProtectedRoute()) {
      this.router.navigateByUrl('auth/login');
    }
  }


  /**
   * Handles authentication errors and displays an error message.
   * @param {any} err The error response that occurred.
   */
  onAuthError(err: any) {
    if (!this.isOnMainRoute(['auth'])) {
      this.toastErrorMsg = (err == this.authService.getTimeoutErrorMsg()) ? 'Server does not respond.' : 'Authentication failed.';
    }
  }


  /**
   * Returns the navigation mode corresponding to the current route.
   */ 
  getNavMode(): undefined | 'login' | 'home' | 'back' {
    switch(this.getFirstRouteSegment()) {
      case 'auth': return this.router.url.includes('login') ? undefined : 'login';
      case 'welcome': return 'login';
      case 'legal': return 'back';
      default: return 'home';
    }
  }
}
