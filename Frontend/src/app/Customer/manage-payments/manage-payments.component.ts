import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PaymentsService } from '../../shared/services/payments.service';
import { Payments } from '../../models/payments';
import { PaymentsCardComponent } from '../../shared/components/payments-card/payments-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-manage-payments',
  imports: [PaymentsCardComponent, PaginationComponent, FooterComponent],
  templateUrl: './manage-payments.component.html',
  styleUrl: './manage-payments.component.css'
})
export class ManagePaymentsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  payments: Payments[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number[] = [];
  totalItems: number = 0;

  constructor(private payment: PaymentsService) { }

  ngOnInit(): void {
    this.fetchPayments();
  }

  fetchPayments(page: number = 1) {
    this.payment.getMyPayments(page, this.pageSize).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.payments = res.payments;
        this.currentPage = page;
        this.totalItems = res.meta.totalItems;
        this.totalPages = Array.from({ length: res.meta.totalPages }, (_, i) => i + 1);
      },
      error: (err) => console.error(err)
    });
  }

  handlePageChange(page: number) {
    if (page !== this.currentPage) {
      this.fetchPayments(page);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
