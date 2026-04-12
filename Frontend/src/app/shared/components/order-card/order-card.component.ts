import { Component, Input } from '@angular/core';
import { DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-order-card',
  imports: [DatePipe, TitleCasePipe, NgClass],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.css'
})
export class OrderCardComponent {
  @Input() order!: Order;

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped':   return 'status-shipped';
      case 'pending':   return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default:          return 'status-pending';
    }
  }
}
