import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../../Auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { ToggleVisibilityDirective } from "../../Directives/toggle-visibility.directive";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ToggleVisibilityDirective, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  onHover: boolean = false;
  isScrolled: boolean = false;

  constructor(private cart: CartService, public auth: AuthService, private router: Router, private toast: ToastService) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scroll = 50;
    this.isScrolled = window.scrollY > scroll;
  }

  @HostListener('window:mouseenter', [])
  onMouseEnter() {
    this.onHover = true;
  }

  @HostListener('window:mouseleave', [])
  onMouseLeave() {
    this.onHover = false;
  }

  onCartClick() {
    this.cart.toggleCardVisibility();
  }

  onLogout() {
    this.auth.logout().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.toast.showToast(200, 'Logout successfully');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
