import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart, GetCart, GetTotal} from '../../models/cart';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private activeCart$ = new BehaviorSubject<Cart| null>(null);
  cart$ = this.activeCart$.asObservable();

  private cartVisible = new BehaviorSubject<boolean>(false);
  cartVisible$ = this.cartVisible.asObservable();

  private isClosing = new BehaviorSubject<boolean>(false);
  isClosing$ = this.isClosing.asObservable();

  private apiUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient) { }

  addToCart(product_id: number, quantity?: number){
    return this.http.post<GetCart>(`${this.apiUrl}/add`, {product_id, quantity}).pipe(
      tap((cart) => 
        this.activeCart$.next(cart.activeCart)
      )
    );
  }
  deleteFromCart(cartItemId: number){
    return this.http.delete<GetCart>(`${this.apiUrl}/delete/${cartItemId}`).pipe(
      tap((cart) => 
        this.activeCart$.next(cart.activeCart)
      )
    );
  }
  updateCart(cartItemId: number, quantity: number){
    return this.http.patch<GetCart>(`${this.apiUrl}/update`, {cartItemId, quantity}).pipe(
      tap((cart) => 
        this.activeCart$.next(cart.activeCart)
      )
    );
  }
  getActiveCart(){
    return this.http.get<GetCart>(`${this.apiUrl}/get-cart`).pipe(
      tap((res) => 
        this.activeCart$.next(res.activeCart)
      )
    );
  }
  calculateTotal(){
    return this.http.get<GetTotal>(`${this.apiUrl}/total`)
  }

  toggleCardVisibility(){
    if(this.cartVisible.value){
      
      this.isClosing.next(true);

      setTimeout(() => {
        this.cartVisible.next(false);
        this.isClosing.next(false);
      },500);
    }
    else{
      this.cartVisible.next(true);
    }
  }
}
