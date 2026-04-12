import { Component } from '@angular/core';
import { AuthService } from '../../Auth/auth.service';
import { User } from '../../models/auth';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  imports: [CommonModule, UserCardComponent, FooterComponent],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {
  private destroy$ = new Subject<void>();

  users: Omit<User, 'password'>[] = [];
  totalItems: number = 0;
  totalPages: number = 1;
  currentPage: number = 1;
  limit: number = 10;
  isLoading: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.isLoading = true;
    this.auth.getAllusers(this.currentPage, this.limit).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.users = res.users;
        this.totalItems = res.meta.totalItems;
        this.totalPages = res.meta.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onLockToggled(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    this.auth.lockUser(userId).subscribe({
      next: () => {
        user.isLocked = !user.isLocked;
      },
      error: (err) => console.error(err)
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchUsers();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
