import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { ErrorService } from '../../../shared/services/error.service';
import { LoadingCircleComponent } from '../../../shared/components/loading-circle/loading-circle.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { CommonModule } from '@angular/common';

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


  ngOnInit(): void {
    this.authService.resettingPw = true;
    this.route.paramMap.subscribe(paramMap => {
      this.token = paramMap.get('token');
      if (this.token) {
        this.activate();
      }
    });
  }


  activate() {
    if (this.token) {
      this.authService.activateAccount(this.token)
        .then(() => this.onActivation())
        .catch((err) => this.onError(err));
    }
  }


  onActivation() {
    this.loading = false;
  }


  onError(err: any) {
    const errRecord = this.errorService.generateErrRecord(err);
    this.error = errRecord.hasOwnProperty('token') ? errRecord['token'][0] : this.errorService.unknownErrorMsg;
    this.loading = false;
  }
}
