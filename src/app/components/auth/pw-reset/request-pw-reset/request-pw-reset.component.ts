import { Component, OnInit } from '@angular/core';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-request-pw-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, FormErrorComponent],
  templateUrl: './request-pw-reset.component.html',
  styleUrl: './request-pw-reset.component.scss'
})
export class RequestPwResetComponent implements OnInit {
  loading: boolean = false;
  formData: any = {
    email: '',
  }

  constructor(private route: ActivatedRoute) {}

  /**
   * This function obtains the email from the query parameters
   * and stores it in the "oobCode" property. 
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params.hasOwnProperty('email')) {
        this.formData.email = params['email'];
      }
    });
  }

  onSubmit(form: NgForm) {

  }
}
