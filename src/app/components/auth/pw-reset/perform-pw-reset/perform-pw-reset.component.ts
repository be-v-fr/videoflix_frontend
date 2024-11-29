import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { ErrorService } from '../../../../shared/services/error.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perform-pw-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, FormErrorComponent],
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


  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public errorService: ErrorService,
  ) { }


  ngOnInit(): void {
    this.authService.resettingPw = true;
    this.route.paramMap.subscribe(paramMap => this.token = paramMap.get('token'));
  }


  ngOnDestroy(): void {
    this.authService.resettingPw = false;    
  }


  onSubmit(form: NgForm) {
    if (form.submitted && this.isValid(form)) {
      this.errorResp = {};

    }
  }


  /**
   * Check if the registration form is valid, including custom password confirmation validation.
   * @param {NgForm} form - The registration form
   * @returns {boolean} Validation check result
   */
  isValid(form: NgForm): boolean {
    return form.form.valid && this.checkPasswordConfirmation();
  }


  /**
   * Check if both passwords match each other.
   * @returns {boolean} Password confirmation check result
   */
  checkPasswordConfirmation(): boolean {
    return this.formData.password == this.formData.passwordConfirmation;
  }
}
