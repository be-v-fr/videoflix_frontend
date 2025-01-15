import { Component, HostListener, Input, OnDestroy, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { AuthService } from '../../shared/services/auth.service';
import { NavSearchComponent } from './nav-search/nav-search.component';
import { DialogComponent } from '../dialog/dialog.component';
import { RequestPwResetComponent } from '../auth/pw-reset/request-pw-reset/request-pw-reset.component';
import { ToastNotificationComponent } from '../../shared/components/toast-notification/toast-notification.component';
import { Subscription } from 'rxjs';
import { BackBtnComponent } from '../../shared/components/back-btn/back-btn.component';


/**
 * Navigation bar operating with different modes to dynamically react to different app features.
 */
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LogoComponent,
    NavSearchComponent,
    DialogComponent,
    ToastNotificationComponent,
    BackBtnComponent
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, OnDestroy {
  @Input() mode?: 'login' | 'home' | 'back';
  requestPwResetComponent: Type<object> = RequestPwResetComponent;
  changePwDialogShowing: boolean = false;
  loggedOut: boolean = false;
  awaitingInit: boolean | 'complete' = false;
  authSub: Subscription = new Subscription();
  accountSubmenuShowingResponsive: boolean = false;


  constructor(
    public router: Router,
    public authService: AuthService
  ) { }


  /**
   * Subscribes to authentication state if no user is currently logged in.
   */
  ngOnInit(): void {
    if (!this.authService.currentUser) {
      this.awaitingInit = true;
      this.authSub = this.subAuth();
    }
  }


  /**
   * Unsubscribes from the authentication subscription to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


  /**
   * Subscribes to authentication state changes.
   * If a user logs in, updates the initialization state and unsubscribes from further changes.
   */
  subAuth(): Subscription {
    return this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.awaitingInit = 'complete';
        this.authSub.unsubscribe();
        setTimeout(() => this.awaitingInit = false, 1000);
      }
    });
  }


  /**
   * Displays the dialog for requesting a password reset.
   */
  showChangePwDialog(): void {
    this.changePwDialogShowing = true;
  }


  /**
   * Logs out the current user and updates the component state.
   */
  logout(): void {
    this.authService.logout();
    this.loggedOut = true;
  }


  /**
   * Redirects the user and resets logged out state.
   */
  onLogout(): void {
    this.router.navigateByUrl('auth');
    this.loggedOut = false;
  }


  showAccountSubmenuResponsive(): void {
    if(window.innerWidth <= 480) {
      this.accountSubmenuShowingResponsive = true;
    }
  }


  @HostListener('window:resize')
  closeAccountSubmenuResponsive(): void {
    this.accountSubmenuShowingResponsive = false;
  }
}
