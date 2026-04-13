import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../Auth/auth.service';
import { CartService } from '../../shared/services/cart.service';
import { AddressService } from '../../shared/services/address.service';
import { Address } from '../../models/address';
import { OrderService } from '../order.service';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { ToastService } from '../../shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Products/product.service';

@Component({
  selector: 'app-order',
  imports: [AsyncPipe, ReactiveFormsModule, FooterComponent, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  selectedAddressId: number | null = null;
  addresses: Omit<Address, 'user'>[] = [];
  newAddress: boolean = false;
  newAddressForm!: FormGroup;
  subTotal!: number;

  constructor(public auth: AuthService, public Cart: CartService, private address: AddressService, private order: OrderService, private fb: FormBuilder, private toast: ToastService, private router: Router) {
    this.newAddressForm = this.fb.group({
      address: ['', Validators.required],
      title: ['', Validators.required],
      setDefault: [false]
    })
  }

  ngOnInit(): void {
    this.address.getAllAddress().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        console.log(res.message);
        this.addresses = res.addresses;
      },
      error: (err) => {
        console.error(err);
      }
    });

    this.calculateSubtotal()
  }

  calculateSubtotal() {
    this.Cart.cart$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(activeCart => {
      if (activeCart && activeCart.cartItems && activeCart.cartItems.length > 0) {
        this.subTotal = activeCart.cartItems.reduce((acc, res) => {
          return acc + (res.quantity * res.product.product_price);
        }, 0)
      }
      else {
        this.subTotal = 0;
      }
    })
  }

  handleCreateAddress() {
    const { address, title, setDefault } = this.newAddressForm.value;
    this.address.createAddress(address, title, setDefault).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        console.log(res.message);

        this.addresses.push(res.address);

        this.newAddressForm.reset();
        this.toggleNewAddress();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  handleCreateOrder() {
    if (this.selectedAddressId) {
      this.order.createOrder(this.selectedAddressId).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (res) => {
          console.log(res.message);
          this.router.navigate(['/order/payments'], { queryParams: { orderId: res.order.order_id } });
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
    else {
      this.toast.showToast(400, 'Please select an address')
    }
  }

  toggleNewAddress() {
    this.newAddress = !this.newAddress;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
