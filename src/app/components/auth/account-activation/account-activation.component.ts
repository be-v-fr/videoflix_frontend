import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { ErrorService } from '../../../shared/services/error.service';
import { LoadingCircleComponent } from '../../../shared/components/loading-circle/loading-circle.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { CommonModule } from '@angular/common';


/**
 * Performs account activation, retrieving the activation token from the URL.
 */
@Component({
  selector: 'app-account-activation',
  standalone: true,
  imports: [CommonModule, LoadingCircleComponent, ToastNotificationComponent],
  templateUrl: './account-activation.component.html',
  styleUrl: './account-activation.component.scss'
})
export class AccountActivationComponent implements OnInit {
  loading: boolean = true;
  token: string | null = null;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService,
    public errorService: ErrorService,
  ) { }


  /**
   * Extracts the activation token from the route and triggers the activation process.
   */
  ngOnInit(): void {
    this.authService.resettingPw = true;
    this.route.paramMap.subscribe(paramMap => {
      this.token = paramMap.get('token');
      if (this.token) {
        this.activate();
      }
    });
  }


  /**
   * Activates the user account using the provided token and handles the server response.
   */
  activate() {
    if (this.token) {
      this.authService.activateAccount(this.token)
        .then(() => this.onActivation())
        .catch((err) => this.onError(err));
    }
  }


  /**
   * Handles successful account activation.
   */
  onActivation() {
    this.loading = false;
  }


  /**
   * Generates an error message and updates the loading state.
   * @param err - The error response returned by the authentication service.
   */
  onError(err: any) {
    const errRecord = this.errorService.generateErrRecord(err);
    this.error = errRecord.hasOwnProperty('token') ? errRecord['token'][0] : this.errorService.unknownErrorMsg;
    this.loading = false;
  }
}
