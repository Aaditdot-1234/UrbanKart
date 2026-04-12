import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordValidators } from '../../shared/CustomValidators/passwordValidators';
import { AuthService } from '../auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';

export interface NewPassword {
  otp: string;
  newPassword: string,
  confirmPassword: string;
}

@Component({
  selector: 'app-resetpassword',
  imports: [ReactiveFormsModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent implements OnInit {
  userEmail!: string;
  otp: string = '';
  newPasswordForm!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private auth: AuthService, private route: ActivatedRoute, private toast: ToastService, private router: Router) {
    this.otp = this.router.getCurrentNavigation()?.extras.state?.['otp'] ?? '';

    if (this.otp) {
      setTimeout(() => { this.otp = ''; }, 10 * 60 * 1000);
    }

    this.newPasswordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8), PasswordValidators.passwordStrength]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, { validators: PasswordValidators.matchPassword });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.userEmail = params['email'] || '';
    })
  }

  changePassword() {
    if (this.newPasswordForm.invalid) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }

    const PasswordDetails = this.newPasswordForm.value as NewPassword;


    this.auth.forgotpassword(this.userEmail, PasswordDetails.otp, PasswordDetails.newPassword).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        console.log(res.message);
        this.toast.showToast(200, res.message);
        this.router.navigate(['/auth/login'])
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
