import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormErrorComponent } from '../../../shared/components/form-error/form-error.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FormErrorComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  formData: any = {
    email: '',
    password: '',
  }

  onSubmit(form: NgForm) {

  }
}
