import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordValidators } from '../../shared/CustomValidators/passwordValidators';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Login, Register } from '../../models/auth';
import { FooterComponent } from "../../shared/components/footer/footer.component";

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, FooterComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy{
  private destroy$ = new Subject<void>();
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), PasswordValidators.passwordStrength]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required]]
    }, { validators: PasswordValidators.matchPassword})
  }

  handleRegister(){
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return;
    }

    const loginData = this.registerForm.value as Register;
    const loginDetails: Login = {
      email: loginData.email,
      password: loginData.password,
    }

    this.auth.register(this.registerForm.value as Register).pipe(
      switchMap(() => 
        this.auth.login(loginDetails)
      ),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log(response.message);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}