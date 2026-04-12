import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { Login } from '../../models/auth';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private cart: CartService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  handleLogin() {
    this.auth.login(this.loginForm.value as Login).pipe(
      switchMap((loginRes) => {
        console.log(loginRes.message);
        return this.cart.getActiveCart();
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log('Cart Loaded', response.message);
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