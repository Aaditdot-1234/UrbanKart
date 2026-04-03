import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordValidators } from '../../shared/CustomValidators/passwordValidators';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), PasswordValidators.passwordStrength]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), PasswordValidators.matchPassword]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required]]
    })
  }
}