import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { ErrorService } from '../../../../shared/services/error.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ToastNotificationComponent } from '../../../../shared/components/toast-notification/toast-notification.component';
import { DynamicPwIconComponent } from '../../../../shared/components/dynamic-pw-icon/dynamic-pw-icon.component';


/**
 * Component to perform a password reset using a token retrieved from the URL.
 */
@Component({
  selector: 'app-perform-pw-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, FormErrorComponent, DynamicPwIconComponent, ToastNotificationComponent],
  templateUrl: './perform-pw-reset.component.html',
  styleUrl: './perform-pw-reset.component.scss'
})
export class PerformPwResetComponent implements OnInit, OnDestroy {
  formData: any = {
    password: '',
    passwordConfirmation: '',
  }
  errorResp: Record<string, string[]> = {};
  token: string | null = null;
  resetMsg: string = 'Password reset complete.';
  resetComplete: boolean | 'finally' = false;


  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public errorService: ErrorService,
  ) { }


  /**
   * Extracts the reset token from the route parameters.
   */
  ngOnInit(): void {
    this.authService.resettingPw = true;
    this.route.paramMap.subscribe(paramMap => this.token = paramMap.get('token'));
  }


  /**
   * Resets the "resettingPw" state in the authentication service.
   */
  ngOnDestroy(): void {
    this.authService.resettingPw = false;    
  }


  /**
   * Validates the form and triggers the password reset process.
   * @param {NgForm} form - The password reset form.
   */
  onSubmit(form: NgForm) {
    if (form.submitted && this.isValid(form) && this.token) {
      this.errorResp = {};
      this.authService.performPasswordReset(this.formData.password, this.token)
        .then(() => this.onReset())
        .catch((err) => this.onError(err));
    }
  }


  /**
   * Validates the password reset form, including custom password confirmation logic.
   * @param {NgForm} form - The password reset form.
   */
  isValid(form: NgForm): boolean {
    return form.form.valid && this.checkPasswordConfirmation();
  }


  /**
   * Checks if the password and password confirmation match.
   */
  checkPasswordConfirmation(): boolean {
    return this.formData.password == this.formData.passwordConfirmation;
  }


  /**
   * Marks the reset process as complete and clears the local session token.
   */
  onReset() {
    this.resetComplete = true;
    this.authService.deleteLocalSessionToken();
    this.authService.resettingPw = false;
  }


  /**
   * Extracts and stores error messages for display.
   * @param {any} err - The error response returned by the authentication service.
   */
  onError(err: any) {
    this.errorResp = this.errorService.generateErrRecord(err);;
  }
}
