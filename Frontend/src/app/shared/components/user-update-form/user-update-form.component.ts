import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../Auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-update-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-update-form.component.html',
  styleUrl: './user-update-form.component.css'
})
export class UserUpdateFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  updateUserform!: FormGroup;
  @Output() close = new EventEmitter<void>();

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.updateUserform = this.fb.group({
      name: ['', [Validators.minLength(3)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) return;

    this.auth.getMe().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.updateUserform.patchValue({
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  handleUpdateform() {
    if (this.updateUserform.invalid) {
      this.updateUserform.markAllAsTouched();
      return;
    }

    const formValue = this.updateUserform.value;

    const updatedDetails = Object.fromEntries(
      Object.entries(formValue).filter(([_, value]) => value !== '' && value !== null)
    );

    this.auth.updateUserInfo(updatedDetails).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.toggleCardVisibility();
  }

  toggleCardVisibility() {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
