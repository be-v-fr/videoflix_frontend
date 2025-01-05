import { Component } from '@angular/core';
import { EmailComponent } from '../../shared/components/email/email.component';
import { environment } from "../../../environments/environment.development";
import { AutoscrollService } from '../../shared/services/autoscroll.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [EmailComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {
  PROVIDER_EMAIL = environment.PROVIDER_EMAIL;

  constructor(
    public autoscrollService: AutoscrollService
  ) { }
}
