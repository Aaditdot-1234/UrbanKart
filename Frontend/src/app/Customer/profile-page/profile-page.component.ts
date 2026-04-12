import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from '../../Auth/auth.service';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';
import { User } from '../../models/auth';
import { OrderService } from '../../Order/order.service';
import { PaymentsService } from '../../shared/services/payments.service';
import { Order } from '../../models/order';
import { Payments } from '../../models/payments';
import { RouterLink } from '@angular/router';
import { OrderCardComponent } from '../../shared/components/order-card/order-card.component';
import { PaymentsCardComponent } from '../../shared/components/payments-card/payments-card.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { UserUpdateFormComponent } from "../../shared/components/user-update-form/user-update-form.component";

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, OrderCardComponent, PaymentsCardComponent, FooterComponent, DatePipe, TitleCasePipe, NgClass, UserUpdateFormComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  userInfo!: Omit<User, 'password'>;
  isVisible: boolean = false;
  hasOpened: boolean = false;

  orders: Order[] = [];
  ordersTotalItems: number = 0;

  payments: Payments[] = [];
  paymentsTotalItems: number = 0;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private paymentsService: PaymentsService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params) => {
        const userId = params['id'];
        console.log(userId);
        return this.auth.getUser(userId);
      })
    ).subscribe({
      next: (response) => {
        console.log(response.message);
        this.userInfo = response.user;
      },
      error: (err) => {
        console.error(err);
      }
    });

    this.fetchOrders();
    this.fetchPayments();
  }

  fetchOrders() {
    this.orderService.getAllOrders(1, 3).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.orders = res.orders;
        this.ordersTotalItems = res.meta.totalItems;
      },
      error: (err) => console.error(err)
    });
  }

  fetchPayments() {
    this.paymentsService.getMyPayments(1, 3).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.payments = res.payments;
        this.paymentsTotalItems = res.meta.totalItems;
      },
      error: (err) => console.error(err)
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  toggleVisibility() {
    if (!this.isVisible) {
      this.isVisible = true;
      this.hasOpened = true;
    } else {
      this.isVisible = false;
    }
  }

  getToggleValue() {
    this.isVisible = !this.isVisible;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
