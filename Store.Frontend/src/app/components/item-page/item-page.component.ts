import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subscription } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { Category } from 'src/app/models/category';
import { Item } from 'src/app/models/item';
import { Manufacture } from 'src/app/models/manufacture';
import { Substance } from 'src/app/models/substance';
import { CartService } from 'src/app/services/cart.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})
export class ItemPageComponent implements OnInit {
  public item$: ReplaySubject<Item> = new ReplaySubject<Item>();
  public itemId: number = 0;
  public count: number = 1;
  public itemTitle: string = "";
  public category$: ReplaySubject<Category> = new ReplaySubject<Category>();
  public substance$: ReplaySubject<Substance> = new ReplaySubject<Substance>();
  public manufacture$: ReplaySubject<Manufacture> = new ReplaySubject<Manufacture>();
  public itemsPopular$: ReplaySubject<Array<Item>> = new ReplaySubject<Array<Item>>();
  private routeSub: Subscription | undefined;

  public navIsFixed: boolean | undefined;

  constructor(private router: Router,
    private actRouter: ActivatedRoute,
    public itemService: ItemService,
    private cartService: CartService,
    public toastr: ToastrService,
    private titlePage: Title) { 
    this.titlePage.setTitle("Добрая аптека - " + this.item$ ); }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });

    this.routeSub = this.actRouter.params.subscribe(
      (data: Params) => {
        let id: number = +data['id']
        this.itemId = id;
        this.getItem();
      });

      this.itemService.incVisitCount(this.itemId);
  }

  getItem(): void {
    this.itemService.getItem(this.itemId).toPromise()
    .then((data: Item | undefined) => {
      if (data) {
        if (data.categoryId) {
          this.itemService.getCategoryTitle(data.categoryId).toPromise().then((data: Category | undefined) => {
            if (data) {
              this.category$.next(data);
            };
          })
        }

        this.item$.next(data);
      }
    })
    .catch((data: HttpErrorResponse) => {
      if(data.status === 404 || data.status === 204) {
        this.router.navigateByUrl("");
      }
    });

    this.itemService.getPopularSmallItems().toPromise()
      .then((data: Item[] | undefined) => {
        if (data) {
          this.itemsPopular$.next(data);
        }
    });
  }

  addCount(): void {
    this.count++;
  }

  reduceCount(): void {
    if (this.count > 1) {
      this.count--;
    }
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
