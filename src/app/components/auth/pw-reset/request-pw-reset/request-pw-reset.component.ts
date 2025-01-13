import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastNotificationComponent } from '../../../../shared/components/toast-notification/toast-notification.component';
import { ErrorService } from '../../../../shared/services/error.service';
import { DialogService } from '../../../../shared/services/dialog.service';


/**
 * Component for requesting a password reset email.
 * It provides functionality to input an email address and trigger a password reset request.
 */
@Component({
  selector: 'app-request-pw-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, FormErrorComponent, ToastNotificationComponent],
  templateUrl: './request-pw-reset.component.html',
  styleUrl: './request-pw-reset.component.scss'
})
export class RequestPwResetComponent implements OnInit {
  loading: boolean = false;
  formData: any = {
    email: '',
  }
  errorResp: Record<string, string[]> = {};
  emailMsg: string = 'A password reset email was sent to your email address.';
  emailSent: boolean | 'finally' = false;
  @HostBinding('class.no-shadow') inDialog: boolean = false;


  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService,
    public errorService: ErrorService,
    private dialogService: DialogService,
  ) {
    this.inDialog = !this.router.url.includes('auth');
  }


  /**
   * This function obtains the email from the query parameters
   * and stores it in the "oobCode" property. 
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('email')) {
        this.formData.email = params['email'];
      }
    });
  }


  /**
   * Validates the form and triggers the password reset request process.
   * @param {NgForm} form - The reset request form.
   */
  onSubmit(form: NgForm) {
    if (form.submitted && form.form.valid) {
      this.loading = true;
      this.errorResp = {};
      this.authService.requestPasswordReset(this.formData.email)
        .then(() => this.onRequest())
        .catch((err) => this.onError(err));
    }
  }


  /**
   * Updates the state to reflect that the email has been sent.
   */
  onRequest() {
    this.emailSent = true;
    this.loading = false;
  }


  /**
   * Extracts and stores error messages for display.
   * @param {any} err - The error response returned by the authentication service.
   */
  onError(err: any) {
    this.errorResp = this.errorService.generateErrRecord(err);
    this.loading = false;
  }

  
  /**
   * Closes opened dialogs of this type.
   */
  closeDialog() {
    this.dialogService.close(RequestPwResetComponent);
  }
}
