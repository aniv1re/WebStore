import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { Item } from 'src/app/models/item';
import { CartService } from 'src/app/services/cart.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public count: number = 1;
  public items$: any[] = [];
  public cartItems: Cart[] = [];
  public isEmptyCart: boolean = true;
  public totalPrice: number = 0;
  public totalItems: number[] = [];
  public totalCartItems: number = 0;

  constructor(public cartService: CartService,
    public itemService: ItemService,
    private router: Router,
    private toastr: ToastrService,
    private title: Title) { this.title.setTitle("Добрая аптека - Корзина" ); }

  ngOnInit(): void {
    this.getItems();
    this.getItemsCount();
  }

  getItems(): void {
    this.cartItems = this.cartService.getCartItems();

    for (let i = 0; i < this.cartItems.length; i++) {
      this.itemService.getItemById(this.cartItems[i].idItem).toPromise()
      .then((data: any) => {
        if (data) {
          this.items$.push(data);
          this.totalItems.push(i);
          this.totalPrice += this.items$[i].price * this.cartItems[i].countItem;
          if (data != undefined) {
            this.isEmptyCart = false;
          }
        }
      });
    }
  }

  deleteItemFromCart(id: number): void {
    this.cartService.removeCartItem(id);
    window.location.reload();
  }

  getItemsCount(): void {
    this.totalCartItems = Number(this.cartService.getCartItemsCount());
  }

  clearCart(): void {
    this.cartService.clearCart();
    window.location.reload();
  }

  addCount(itemId: number): void {
    this.cartService.addCountToItem(itemId);
    window.location.reload();
  }

  reduceCount(itemId: number): void {
    if (!this.cartService.checkToMinusValue(itemId)) {
      this.cartService.reduceCountToItem(itemId);
      window.location.reload();
    }
  }

  getCount(itemId: number): number {
    let data = this.cartItems.find(x => x.idItem == itemId)?.countItem;
    if (data) 
      return data;
    else 
      return 1;
  }

  moveToItem(itemId: number): void {
    this.router.navigateByUrl("catalog/" + itemId);
  }

  roudTotalPrice(): any {
    return this.totalPrice.toFixed(2);
  }
}
