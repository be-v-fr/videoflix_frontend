import { Component, OnInit } from '@angular/core';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { ToastNotificationComponent } from '../../../../shared/components/toast-notification/toast-notification.component';
import { ErrorService } from '../../../../shared/services/error.service';

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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public errorService: ErrorService,
  ) { }


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

  onSubmit(form: NgForm) {
    if (form.submitted && form.form.valid) {
      this.loading = true;
      this.errorResp = {};
      this.authService.requestPasswordReset(this.formData.email)
        .then(() => this.onRequest())
        .catch((err) => this.onError(err));
    }
  }

  onRequest() {
    this.emailSent = true;
    this.loading = false;
  }

  onError(err: any) {
    this.errorResp = this.errorService.generateErrRecord(err);
    this.loading = false;
  }
}
