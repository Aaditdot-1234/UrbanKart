import { Component, Input } from '@angular/core';
import { DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { Order } from '../../../models/order';
import { ToggleVisibilityDirective } from "../../Directives/toggle-visibility.directive";

@Component({
  selector: 'app-order-card',
  imports: [DatePipe, TitleCasePipe, NgClass, ToggleVisibilityDirective],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.css'
})
export class OrderCardComponent {
  @Input() order!: Order;
  isVisible: boolean = false; 

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped':   return 'status-shipped';
      case 'pending':   return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default:          return 'status-pending';
    }
  }

  toggleVisibility(){
    this.isVisible = !this.isVisible;
  }
}
