import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from '../../Auth/auth.service';
import { OrderService } from '../order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/order';
import { ToastService } from '../../shared/services/toast.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-payment',
  imports: [FooterComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  orderId!: number;
  orderDetails: Order | null = null;
  selectedMethod: string = '';
  selectedMethodLabel: string = '';

  paymentMethods = [
    { id: 'Credit Card', label: 'Credit Card', description: 'Visa, Mastercard, Rupay' },
    { id: 'Debit Card', label: 'Debit Card', description: 'Visa, Mastercard, Rupay' },
    { id: 'Bank Transfer', label: 'Bank Transfer', description: 'Transfer from your bank account' },
    { id: 'Online', label: 'Online', description: 'Pay using any UPI app' },
    { id: 'Cash on Delivery', label: 'Cash on Delivery', description: 'Pay when you receive your order' },
  ];

  constructor(public auth: AuthService, private orderService: OrderService, private route: ActivatedRoute, private router: Router, private toast: ToastService) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(params => {
        this.orderId = +params['orderId'];
        return this.orderId ? this.orderService.getOrderById(this.orderId) : EMPTY;
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.orderDetails = res.order;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  selectMethod(method: string) {
    this.selectedMethod = method;
    this.selectedMethodLabel = this.paymentMethods.find(m => m.id === this.selectedMethod)?.label ?? '';
  }

  confirmPayment() {
    if (!this.selectedMethod) {
      this.toast.showToast(400, 'Please select a payment method');
      return;
    }
    this.handleUpdateOrder(this.orderId, this.selectedMethod);
  }

  handleUpdateOrder(orderId: number, payment_method: string) {
    this.orderService.updateOrder(orderId, payment_method).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        console.log(res.message);
        this.toast.showToast(200, 'Payment confirmed!');
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
