import { Component, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { AuthService } from '../../shared/services/auth.service';
import { SearchComponent } from '../../shared/components/search/search.component';
import { DialogComponent } from '../dialog/dialog.component';
import { RequestPwResetComponent } from '../auth/pw-reset/request-pw-reset/request-pw-reset.component';
import { ToastNotificationComponent } from '../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, LogoComponent, SearchComponent, DialogComponent, ToastNotificationComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  requestPwResetComponent: Type<object> = RequestPwResetComponent;
  changePwDialogShowing: boolean = false;
  loggedOut: boolean = false;

  constructor(
    public router: Router,
    public authService: AuthService
  ) { }

  showChangePwDialog(): void {
    this.changePwDialogShowing = true;
  }

  logout(): void {
    this.authService.logout();
    this.loggedOut = true;
  }
}
