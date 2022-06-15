import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { Item } from 'src/app/models/item';
import { News } from 'src/app/models/news';
import { CartService } from 'src/app/services/cart.service';
import { ItemService } from 'src/app/services/item.service';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public items$: ReplaySubject<Array<Item>> = new ReplaySubject<Array<Item>>();
  public news$: News[] = [];

  constructor(public itemService: ItemService,
    private router: Router,
    private title: Title,
    private cartService: CartService,
    private toastr: ToastrService,
    private newsService: NewsService) { 
      this.title.setTitle("Добрая аптека - Главная" ); }

  ngOnInit(): void {
    this.loadNews();
    this.loadItems();
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

  loadItems(): void {
    this.itemService.getPopularItems().toPromise()
    .then((data: Item[] | undefined) => {
      if (data) {
        this.items$.next(data);
      }
    });
  }

  loadNews(): void {
    this.newsService.getLastNews().toPromise()
    .then((data: News[] | undefined) => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          this.news$.push(data[i]);
          
        }
      }
    });
  }
}
