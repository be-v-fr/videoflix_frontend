import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, FormErrorComponent, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  formData: any = {
    email: '',
    password: '',
    passwordConfirmation: '',
  }

  onSubmit(form: NgForm) {
    
  }
}
