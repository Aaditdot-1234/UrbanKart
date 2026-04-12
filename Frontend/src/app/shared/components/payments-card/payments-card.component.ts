import { Component, Input } from '@angular/core';
import { DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { Payments } from '../../../models/payments';

@Component({
  selector: 'app-payments-card',
  imports: [DatePipe, TitleCasePipe, NgClass],
  templateUrl: './payments-card.component.html',
  styleUrl: './payments-card.component.css'
})
export class PaymentsCardComponent {
  @Input() payment!: Payments;

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'success':   return 'status-delivered';
      case 'pending':   return 'status-pending';
      case 'failed':
      case 'cancelled': return 'status-cancelled';
      default:          return 'status-pending';
    }
  }
}
