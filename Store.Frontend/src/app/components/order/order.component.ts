import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { MapItem } from 'src/app/models/mapItem';
import { UserToken } from 'src/app/models/userToken';
import { CartService } from 'src/app/services/cart.service';
import { ItemService } from 'src/app/services/item.service';
import { LocationService } from 'src/app/services/location.service';
import { OrderService } from 'src/app/services/order.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public user: string = "";
  public isLogged: boolean = false;
  private token: UserToken | undefined;
  public locationPoints$: ReplaySubject<Array<MapItem>> = new ReplaySubject<Array<MapItem>>();
  public selectedLocationId: number | undefined;
  public selectedLocation$: ReplaySubject<MapItem> = new ReplaySubject<MapItem>();

  public items$: any[] = [];
  public cartItems: Cart[] = [];
  public isEmptyCart: boolean = true;
  public totalPrice: number = 0;
  public totalItems: number[] = [];
  public totalCartItems: number = 0;

  constructor(private tokenService: TokenService,
    private orderService: OrderService,
    private locationService: LocationService,
    private cartService: CartService,
    private itemService: ItemService) { 
    this.token = this.tokenService.token;

    if (this.token)
      this.user = this.tokenService.token.email;
  
    this.isLogged = this.tokenService.token != null ? true : false;
  }

  ngOnInit(): void {
    this.getLocations();
    this.getItems();
  }

  getLocations(): void {
    this.orderService.getLocations(this.locationService.getUserLocation()).toPromise()
    .then((data: MapItem[] | undefined) => {
      if (data) {
        this.locationPoints$.next(data);
      }
    });
  }

  selectLocation(id: number): void {
    this.selectedLocationId = id;

    this.orderService.getLocationById(id).toPromise().then((data: MapItem | undefined) => {
      if (data) {
        this.selectedLocation$.next(data);
      }
    })
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

  getCount(itemId: number): number {
    let data = this.cartItems.find(x => x.idItem == itemId)?.countItem;
    if (data) 
      return data;
    else 
      return 1;
  }

  roudTotalPrice(): any {
    return this.totalPrice.toFixed(2);
  }
}
