import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormErrorComponent } from '../../shared/components/form-error/form-error.component';


/**
 * Displays the landing page,
 * including an optional email input form to accelerate the signup process.
 */
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


  /**
   * Validates the form and redirects to the signup form.
   * @param {NgForm} form - The form containing the user's email address.  
   */
  onSubmit(form: NgForm) {
    if (form.submitted && form.form.valid) {
      this.router.navigate(['auth', 'signup', this.formData.email]);
    }
  }
}
