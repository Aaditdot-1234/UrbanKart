import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../Auth/auth.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  private destroy$ = new Subject<void>();

  constructor(public auth: AuthService, private order: OrderService) { }

  ngOnInit(): void {
  }

  handleUpdateOrder(orderId: number, paymentId: number){
    this.order.updateOrder(orderId, paymentId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        console.log(res.message);
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
