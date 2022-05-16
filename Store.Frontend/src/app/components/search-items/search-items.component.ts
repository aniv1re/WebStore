import { HttpErrorResponse } from '@angular/common/http';
import { Component, DoCheck, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subscription } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { Item } from 'src/app/models/item';
import { CartService } from 'src/app/services/cart.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-search-items',
  templateUrl: './search-items.component.html',
  styleUrls: ['./search-items.component.css']
})
export class SearchItemsComponent implements OnInit {
  public rangeValues: number[] = [1, 5000];
  private routeSub: Subscription | undefined;
  public filters: any[];
  public items$: ReplaySubject<Item[]> = new ReplaySubject<Item[]>();
  public selectedFilter: string | undefined;
  public searchName: string = "";
  public itemsCount: number = -1;
  public isUpdated: boolean = false;

  constructor( private router: Router,
    private actRouter: ActivatedRoute,
    public itemService: ItemService,
    public title: Title,
    private cartService: CartService,
    public toastr: ToastrService ) {    
    this.filters = [
    {name: 'По умолчанию', value: 'default'},

    {name: 'По алфавиту ↑', value: 'alphabetAsc'},
    {name: 'По алфавиту ↓', value: 'alphabetDesc'},
    
    {name: 'По цене ↑', value: 'priceAsc'},
    {name: 'По цене ↓', value: 'priceDesc'},
    
    {name: 'По популярности ↑', value: 'popularAsc'},
    {name: 'По популярности ↓', value: 'popularDesc'}]
    this.title.setTitle("Добрая аптека - Поиск лекарственных стредств");
    }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });

    this.routeSub = this.actRouter.params.subscribe(
      (data: Params) => {
        this.itemsCount = 0;
        let name: string = data['name']
        this.searchName = name; 
        this.getItems();
      }); 
  }

  getItems(): void {
    this.itemService.getItemsByName(this.searchName).toPromise()
    .then((data: Item[] | undefined) => {
      if (data) {
        this.itemsCount = data.length;
        this.items$.next(data);
      }
    })
    .catch((data: HttpErrorResponse) => {
      if(data.status === 404 || data.status === 204) {
        this.router.navigateByUrl("");
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
