import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { Login } from '../../models/auth.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth:AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  handleLogin(){
    this.auth.login(this.loginForm.value as Login).pipe(
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

  forgotPassword(){
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}