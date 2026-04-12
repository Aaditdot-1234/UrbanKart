import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private destroy$ = new Subject<void>();
  email!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.email = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  generateOTP() {
    const emailValue = this.email.get('email')?.value;

    if (this.email.valid && emailValue) {
      this.auth.getOTP(emailValue).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (res) => {
          this.router.navigate(['/auth/reset-password'], {
            queryParams: { email: emailValue },
            state: { otp: res.otp }
          });
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }
}
