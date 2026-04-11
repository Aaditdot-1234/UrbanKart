import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../Auth/auth.service';
import { CartService } from '../../shared/services/cart.service';
import { AddressService } from '../../shared/services/address.service';
import { Address } from '../../models/address';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  addresses: Omit<Address, 'user'>[] = [];

  constructor(public auth: AuthService, private Cart: CartService, private address: AddressService, private order: OrderService){}
  
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
  }

  handleCreateAddress(newAddress: string, newTitle:string, setDefault: boolean = false){
    this.address.createAddress(newAddress, newTitle, setDefault).pipe(
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

  handleCreateOrder(addressId: number){
    this.order.createOrder(addressId).pipe(
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
