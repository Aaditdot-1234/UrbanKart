import { Component } from '@angular/core';
import { AuthService } from '../../Auth/auth.service';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../models/auth';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, UserCardComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private destroy$ = new Subject<void>();
  userInfo!: Omit<User, 'password'>;

  users: Omit<User, 'password'>[] = [];
  usersTotalItems: number = 0;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (user) this.userInfo = user;
    });

    this.fetchUsers();
  }

  fetchUsers() {
    this.auth.getAllusers(1, 3).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.users = res.users;
        this.usersTotalItems = res.meta.totalItems;
      },
      error: (err) => console.error(err)
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
