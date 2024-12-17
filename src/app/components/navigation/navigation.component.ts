import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { AuthService } from '../../shared/services/auth.service';
import { SearchComponent } from '../../shared/components/search/search.component';
import { DialogComponent } from '../dialog/dialog.component';
import { RequestPwResetComponent } from '../auth/pw-reset/request-pw-reset/request-pw-reset.component';
import { ToastNotificationComponent } from '../../shared/components/toast-notification/toast-notification.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, LogoComponent, SearchComponent, DialogComponent, ToastNotificationComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, OnDestroy {
  requestPwResetComponent: Type<object> = RequestPwResetComponent;
  changePwDialogShowing: boolean = false;
  loggedOut: boolean = false;
  awaitingInit: boolean | 'complete' = false;
  authSub: Subscription = new Subscription();

  constructor(
    public router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    if(!this.authService.currentUser) {
      this.awaitingInit = true;
      this.authSub = this.subAuth();
    }
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  subAuth(): Subscription {
    return this.authService.currentUser$.subscribe(user => {
      if(user) {
        this.awaitingInit = 'complete';
        this.authSub.unsubscribe();
      }
    });
  }

  showChangePwDialog(): void {
    this.changePwDialogShowing = true;
  }

  logout(): void {
    this.authService.logout();
    this.loggedOut = true;
  }
}
