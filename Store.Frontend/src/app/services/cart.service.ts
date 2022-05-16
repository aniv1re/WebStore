import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public userCart: Cart[] = []; 

  constructor() {
    let data = localStorage.getItem('cart');
    if (data !== null) {
        let parsedData: Cart[] = JSON.parse(data);
        this.userCart = parsedData;
    }
  }

  getCartItems(): Cart[] {
    return this.userCart;
  }

  getCartItemsCount(): string {
    return this.userCart.length.toString();
  }

  addItemToCart(itemCart: Cart): void {
    let isExists: boolean = false;

    for (let i = 0; i < this.userCart.length; i++) {
      if (itemCart.idItem == this.userCart[i].idItem) {
        isExists = true;
      }    
    }
    
    if (!isExists) {
      this.userCart?.push(itemCart);
      localStorage.setItem('cart', JSON.stringify(this.userCart));   
    }
  }

  removeCartItem(id: number): void {
    for (let i = 0; i < this.userCart.length; i++) {
      if (this.userCart[i].idItem == id) {
        this.userCart.splice(i, 1);
      }      
    }

    localStorage.setItem('cart', JSON.stringify(this.userCart));
  }

  addCountToItem(id: number): void {
    for (let i = 0; i < this.userCart.length; i++) {
      if (this.userCart[i].countItem < 99 && this.userCart[i].idItem == id) {
        this.userCart[i].countItem++;
      }
    }
    
    this.clearCart();
    localStorage.setItem('cart', JSON.stringify(this.userCart));
  }

  reduceCountToItem(id: number): void {
    for (let i = 0; i < this.userCart.length; i++) {
      if (this.userCart[i].countItem > 1 && this.userCart[i].idItem == id) {
        this.userCart[i].countItem--;
      }
    }

    this.clearCart();
    localStorage.setItem('cart', JSON.stringify(this.userCart));
  }

  checkToMinusValue(id: number): boolean {
    let tempCheck: boolean = false;
    
    for (let i = 0; i < this.userCart.length; i++) {
      if (this.userCart[i].countItem == 1 && this.userCart[i].idItem == id) {
        tempCheck = true;
      }
    }
    
    return tempCheck;
  }

  clearCart(): void {
    localStorage.removeItem('cart');
  }
}