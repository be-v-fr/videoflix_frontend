import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormErrorComponent } from '../../shared/components/form-error/form-error.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [FormsModule, FormErrorComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  formData: any = {
    email: '',
  }


  constructor(
    private router: Router,
  ) { }


  onSubmit(form: NgForm) {
    if (form.submitted && form.form.valid) {
      this.router.navigate(['auth', 'signup', this.formData.email]);
    }
  }
}
