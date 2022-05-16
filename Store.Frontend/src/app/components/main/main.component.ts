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
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public items$: ReplaySubject<Array<Item>> = new ReplaySubject<Array<Item>>();

  constructor(public itemService: ItemService,
    private router: Router,
    private title: Title,
    private cartService: CartService,
    public toastr: ToastrService) { this.title.setTitle("Добрая аптека - Главная" ); }

  ngOnInit(): void {
    this.itemService.getPopularItems().toPromise()
      .then((data: Item[] | undefined) => {
        if (data) {
          this.items$.next(data);
        }
    });
  }

  moveToItem(itemId: number): void {
    this.router.navigateByUrl("catalog/" + itemId);
  }

  addToCart(itemId: number, count: number): void {
    var cartItem = new Cart(itemId, count, new Date());
    this.cartService.addItemToCart(cartItem);

    this.toastr.success('Товар добавлен в корзину!', 'Корзина', {
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
    });
  }
}
