import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subscription } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { Category } from 'src/app/models/category';
import { Item } from 'src/app/models/item';
import { SortState } from 'src/app/models/sortState';
import { CartService } from 'src/app/services/cart.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-search-categories-items',
  templateUrl: './search-categories-items.component.html',
  styleUrls: ['./search-categories-items.component.css']
})
export class SearchCategoriesItemsComponent implements OnInit {
  public category$: ReplaySubject<Category> = new ReplaySubject<Category>();
  public items$: Item[] | undefined;
  private routeSub: Subscription | undefined;
  public filters: any[];
  public selectedFilter: any | undefined;
  public itemsCount: number = 0;
  public categoryId: number = 0;
  public sortState: SortState = 2;
  
  constructor(private router: Router,
    private actRouter: ActivatedRoute,
    public itemService: ItemService,
    private httpClient: HttpClient,
    public title: Title,
    private cartService: CartService,
    public toastr: ToastrService ) { 
      this.filters = [
        {name: 'По умолчанию', value: 2},
        {name: 'По алфавиту ↑', value: 4},
        {name: 'По алфавиту ↓', value: 2},
        {name: 'По цене ↑', value: 16},
        {name: 'По цене ↓', value: 32},
        {name: 'По популярности ↑', value: 64},
        {name: 'По популярности ↓', value: 128}]

        this.title.setTitle("Добрая аптека - Поиск по категориям");
    }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
    
    this.actRouter.queryParams.subscribe(params => {
      this.categoryId = params['categoriesId'];
      this.sortState = params['sortState'];
    });

    if (this.categoryId) {
      this.searchCategoryData(this.categoryId);
    }

    this.getItems();

    switch (Number(this.sortState)) {
      case 2: {
        this.selectedFilter = {name: 'По умолчанию', value: 2};
        break;
      }
      case 4: {
        this.selectedFilter = {name: 'По алфавиту ↓', value: 4};
        break;
      }
      case 16: {
        this.selectedFilter = {name: 'По цене ↑', value: 16};
        break;
      }
      case 32: {
        this.selectedFilter = {name: 'По цене ↓', value: 32};
        break;
      }
      case 64: {
        this.selectedFilter = {name: 'По популярности ↑', value: 64};
        break;
      }
      case 128: {
        this.selectedFilter = {name: 'По популярности ↓', value: 128};
        break;
      }
    }
  }

  searchCategoryData(categoryId: number): void {
    this.itemService.getCategoryTitle(categoryId).toPromise().then((data: Category | undefined) => {
      if (data) {
        this.category$.next(data);
      };
    })
  }

  search(): void {
    this.router.navigateByUrl("/categories/search?categoriesId=" + this.categoryId + "&sortState=" + this.selectedFilter.value).then(() => {
      window.location.reload();
    });
  }

  getItems(): void {
    this.itemService.getItemsByCategoriesWithFilter(this.categoryId, Number(this.sortState)).toPromise()
    .then((data: any) => {
      if (data) {
        this.itemsCount = data.length;
        this.items$ = (data);
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
