import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { ErrorService } from '../../../shared/services/error.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FormErrorComponent, RouterLink, ToastNotificationComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loading: boolean = false;
  formData: any = {
    email: '',
    password: '',
  }
  errorResp: Record<string, string[]> = {};
  loginComplete: boolean = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    public errorService: ErrorService,
  ) {}

  onSubmit(form: NgForm) {
    if (form.submitted && form.form.valid) {
      this.loading = true;
      this.authService.login(this.formData.email, this.formData.password)
        .then((resp) => this.onLogin(resp))
        .catch((err) => this.onError(err));
    }
  }


  onLogin(resp: any) {
    this.authService.onLogin(resp);
    this.loginComplete = true;
  }


  onError(err: any) {
    this.errorResp = this.errorService.generateErrRecord(err);
    this.loading = false;
  }
}
