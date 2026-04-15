import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../models/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-card',
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  @Input() user!: Omit<User, 'password'>;
  @Input() showLockButton: boolean = false;
  @Output() lockToggled = new EventEmitter<string>();

  constructor(private router: Router){}

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  onLockUser() {
    this.lockToggled.emit(this.user.id);
  }
}
