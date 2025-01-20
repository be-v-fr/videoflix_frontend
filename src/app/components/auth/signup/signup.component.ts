import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { AuthService } from '../../../shared/services/auth.service';
import { ErrorService } from '../../../shared/services/error.service';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { CustomCheckboxComponent } from '../../../shared/components/custom-checkbox/custom-checkbox.component';
import { DynamicPwIconComponent } from '../../../shared/components/dynamic-pw-icon/dynamic-pw-icon.component';


/**
 * Displays a signup form to the user.
 */
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormErrorComponent,
    DynamicPwIconComponent,
    CustomCheckboxComponent,
    RouterLink,
    ToastNotificationComponent
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  @ViewChild('passwordInput', { static: true }) passwordRef!: ElementRef<HTMLInputElement>;
  loading: boolean = false;
  formData: any = {
    email: '',
    password: '',
    passwordConfirmation: '',
    privacyCheck: false,
  };
  errorResp: Record<string, string[]> = {};
  emailMsg: string = 'A confirmation email was sent to your email address.';
  emailSent: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public errorService: ErrorService,
  ) { }


  /**
   * Populates the email field from route parameters if provided.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const email: string | null = paramMap.get('email');
      if (email) {
        this.formData.email = email;
        this.passwordRef.nativeElement.focus();
      }
    });
  }


  /**
   * Validates the form and triggers the registration process.
   * @param {NgForm} form - The signup form.
   */
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
   * Validates the signup form, including custom password confirmation checks.
   * @param {NgForm} form - The signup form.
   */
  isValid(form: NgForm): boolean {
    return form.form.valid && this.checkPasswordConfirmation() && this.formData.privacyCheck;
  }


  /**
   * Checks if both passwords match each other.
   */
  checkPasswordConfirmation(): boolean {
    return this.formData.password == this.formData.passwordConfirmation;
  }


  /**
   * Handles successful signup.
   */
  onSignup() {
    this.emailSent = true;
  }


  /**
   * Extracts and stores error messages and resets the loading state.
   * @param {any} err - The error response returned by the authentication service.
   */
  onError(err: any) {
    this.errorResp = this.errorService.generateErrRecord(err);
    this.loading = false;
  }
}