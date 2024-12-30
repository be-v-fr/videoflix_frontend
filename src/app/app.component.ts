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
    localStorage.getItem('token') ? this.handleToken() : this.redirect();
  }


  handleToken() {
    this.authService.authenticateToken()
      .then(resp => this.authService.triggerUser(resp))
      .catch(err => this.onAuthError(err));
  }


  getFirstRouteSegment() {
    return this.router.url.split('/')[1]
  }


  isOnMainRoute(firstSegments: string[]) {
    return firstSegments.includes(this.getFirstRouteSegment());
  }


  isOnEmptyRoute(): boolean {
    return this.getFirstRouteSegment().length === 0;
  }


  isOnProtectedRoute(): boolean {
    return !this.isOnMainRoute(['welcome', 'auth', 'legal']);
  }


  redirect() {
    if(this.isOnEmptyRoute()) {
      this.router.navigateByUrl('welcome');
    } else {
      this.redirectToLogin();
    }
  }


  redirectToLogin() {
    if (this.isOnProtectedRoute()) {
      this.router.navigateByUrl('auth/login');
    }
  }


  onAuthError(err: any) {
    if (!this.isOnMainRoute(['auth'])) {
      this.toastErrorMsg = (err == this.authService.getTimeoutErrorMsg()) ? 'Server does not respond.' : 'Authentication failed.';
    }
  }


  setNavMode() {
    switch(this.getFirstRouteSegment()) {
      case 'auth': this.navMode = this.router.url.includes('login') ? 'signup' : 'login'; break;
      case 'welcome': this.navMode = 'login'; break;
      case 'legal': this.navMode = 'back'; break;
      default: this.navMode = 'home';
    }
  }
}
