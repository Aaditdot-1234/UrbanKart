import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './shared/services/toast.service';
import { AsyncPipe } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CartService } from './shared/services/cart.service';
import { CartComponent } from "./shared/components/cart/cart.component";
import { AuthService } from './Auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, NavbarComponent, CartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Frontend';

  constructor(public toast: ToastService, public cart: CartService, private auth: AuthService) { }

  ngOnInit(): void {
    console.log(this.auth.isLoggedIn());
    if(this.auth.isLoggedIn()){
      this.cart.getActiveCart().subscribe();
    }
  }
}
