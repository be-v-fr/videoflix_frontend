import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { AuthService } from '../../../shared/services/auth.service';
import { ErrorService } from '../../../shared/services/error.service';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, FormErrorComponent, RouterLink, ToastNotificationComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  loading: boolean = false;
  formData: any = {
    email: '',
    password: '',
    passwordConfirmation: '',
    privacyCheck: false,
  };
  errorResp: Record<string, string[]> = {};
  emailMsg: string = 'A confirmation email was sent to your email address.';
  emailSent: boolean | 'finally' = false;

  constructor(
    private authService: AuthService,
    public errorService: ErrorService,
  ) { }

  onSubmit(form: NgForm) {
    if (form.submitted && this.isValid(form)) {
      this.errorResp = {};
      this.loading = true;
      this.authService.register(this.formData.email, this.formData.password)
        .then(() => this.onSignup())
        .catch((err) => this.onError(err));
    }
  }


  /**
   * Check if the registration form is valid, including custom password confirmation validation.
   * @param {NgForm} form - The registration form
   * @returns {boolean} Validation check result
   */
  isValid(form: NgForm): boolean {
    return form.form.valid && this.checkPasswordConfirmation() && this.formData.privacyCheck;
  }


  /**
   * Check if both passwords match each other.
   * @returns {boolean} Password confirmation check result
   */
  checkPasswordConfirmation(): boolean {
    return this.formData.password == this.formData.passwordConfirmation;
  }

  onSignup() {
    this.emailSent = true;
  }

  onError(err: any) {
    this.errorResp = this.errorService.generateErrRecord(err);
    this.loading = false;
  }
}