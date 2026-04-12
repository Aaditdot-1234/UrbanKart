import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../Order/order.service';
import { Order } from '../../models/order';
import { FormsModule } from '@angular/forms';
import { OrderCardComponent } from '../../shared/components/order-card/order-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-manage-orders',
  imports: [FormsModule, OrderCardComponent, PaginationComponent, FooterComponent],
  templateUrl: './manage-orders.component.html',
  styleUrl: './manage-orders.component.css'
})
export class ManageOrdersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  displayOrders: Order[] | Omit<Order, 'orderProducts'>[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number[] = [];
  totalItems: number = 0;

  activeStatus: string = 'all';
  startDate: string = '';
  endDate: string = '';
  dateError: string = '';

  readonly statuses = ['all', 'pending', 'shipped', 'delivered', 'cancelled'];

  constructor(private order: OrderService) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(page: number = 1) {
    this.order.getAllOrders(page, this.pageSize).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.displayOrders = res.orders;
        this.currentPage = page;
        this.totalItems = res.meta.totalItems;
        this.totalPages = Array.from({ length: res.meta.totalPages }, (_, i) => i + 1);
      },
      error: (err) => console.error(err)
    });
  }

  filterByStatus(status: string) {
    this.activeStatus = status;
    this.currentPage = 1;

    if (status === 'all') {
      this.fetchOrders();
      return;
    }

    this.order.filterOrderByStatus(status, 1, this.pageSize).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.displayOrders = res.orders;
        this.totalItems = res.meta.totalItems;
        this.totalPages = Array.from({ length: res.meta.totalPages }, (_, i) => i + 1);
      },
      error: (err) => console.error(err)
    });
  }

  applyDateFilter() {
    this.dateError = '';
    if (!this.startDate || !this.endDate) {
      this.dateError = 'Please select both start and end dates.';
      return;
    }
    if (new Date(this.startDate) > new Date(this.endDate)) {
      this.dateError = 'Start date cannot be after end date.';
      return;
    }

    this.activeStatus = 'all';
    this.order.filterOrderByDate(new Date(this.startDate), new Date(this.endDate), 1, this.pageSize).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.displayOrders = res.orders;
        this.totalItems = res.meta.totalItems;
        this.totalPages = Array.from({ length: res.meta.totalPages }, (_, i) => i + 1);
      },
      error: (err) => console.error(err)
    });
  }

  clearFilters() {
    this.activeStatus = 'all';
    this.startDate = '';
    this.endDate = '';
    this.dateError = '';
    this.fetchOrders();
  }

  handlePageChange(page: number) {
    if (page === this.currentPage) return;

    if (this.activeStatus !== 'all') {
      this.order.filterOrderByStatus(this.activeStatus, page, this.pageSize).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (res) => {
          this.displayOrders = res.orders;
          this.currentPage = page;
          this.totalItems = res.meta.totalItems;
          this.totalPages = Array.from({ length: res.meta.totalPages }, (_, i) => i + 1);
        },
        error: (err) => console.error(err)
      });
    } else if (this.startDate && this.endDate) {
      this.order.filterOrderByDate(new Date(this.startDate), new Date(this.endDate), page, this.pageSize).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (res) => {
          this.displayOrders = res.orders;
          this.currentPage = page;
          this.totalItems = res.meta.totalItems;
          this.totalPages = Array.from({ length: res.meta.totalPages }, (_, i) => i + 1);
        },
        error: (err) => console.error(err)
      });
    } else {
      this.fetchOrders(page);
    }
  }

  get isFiltering(): boolean {
    return this.activeStatus !== 'all' || !!(this.startDate && this.endDate);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
