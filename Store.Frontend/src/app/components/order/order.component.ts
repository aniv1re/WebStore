import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { Guest } from 'src/app/models/guest';
import { MapItem } from 'src/app/models/mapItem';
import { OrderViewModel, StatusId } from 'src/app/models/orderViewModel';
import { OrderItem } from 'src/app/models/orderItem';
import { UserToken } from 'src/app/models/userToken';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ItemService } from 'src/app/services/item.service';
import { LocationService } from 'src/app/services/location.service';
import { OrderService } from 'src/app/services/order.service';
import { TokenService } from 'src/app/services/token.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public user: string = "";
  public isLogged: boolean = false;
  private token: UserToken;
  public locationPoints$: ReplaySubject<Array<MapItem>> = new ReplaySubject<Array<MapItem>>();
  public selectedLocationId: number = 0;
  public selectedLocation$: ReplaySubject<MapItem> = new ReplaySubject<MapItem>();

  public items$: any[] = [];
  public cartItems: Cart[] = [];
  public isEmptyCart: boolean = true;
  public totalPrice: number = 0;
  public totalItems: number[] = [];
  public totalCartItems: number = 0;
  public isOrdered: boolean = false;
  public createdOrderId: number = 0;
  public orderGivinDate: Date = new Date();
  public selectLocationStreet: string = "";
  public createdGuestId: number = 0;

  constructor(private tokenService: TokenService,
    private orderService: OrderService,
    private locationService: LocationService,
    private cartService: CartService,
    private itemService: ItemService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private titlePage: Title) { 
    this.titlePage.setTitle("Добрая аптека - Оформление заказа" ); 
    this.token = this.tokenService.token;

    if (this.token)
      this.user = this.tokenService.token.email;
  
    this.isLogged = this.tokenService.token != null ? true : false;
  }

  ngOnInit(): void {
    if (this.cartService.getCartItems().length == 0) {
      this.router.navigateByUrl("");
    }
    else {
      this.getLocations();
      this.getItems();
    }
  }

  getLocations(): void {
    console.log(this.locationService.getUserLocation())
    this.orderService.getLocations(this.locationService.getUserLocation())
    .toPromise()
    .then((data: MapItem[] | undefined) => {
      if (data) {
        this.locationPoints$.next(data);
      }
    });
  }

  selectLocation(id: number): void {
    this.selectedLocationId = id;

    this.orderService.getLocationById(id)
    .toPromise()
    .then((data: MapItem | undefined) => {
      if (data) {
        this.selectedLocation$.next(data);
        this.selectLocationStreet = data.address;
      }
    });
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


  createOrder(): void {
    if (this.selectedLocationId == 0) {
      this.toastr.error('Выберите пункт выдачи товара, чтобы продолжить!', 'Оформление заказа', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else {
      if (this.isLogged) {
        var items: OrderItem[] = [];
        for (let i = 0; i < this.cartItems.length; i++) {
          items.push(new OrderItem(this.cartItems[i].idItem, this.cartItems[i].countItem));
          //this.itemService.decreaseItemStock(this.cartItems[i].idItem, this.cartItems[i].countItem);
        }

        let ord = new OrderViewModel(this.token?.id, JSON.stringify(items), this.totalPrice, StatusId.checking, this.selectedLocationId, new Date(), false, -1);

        this.orderService.createNewOrder(ord).toPromise().then((data: number | undefined) => {
          if (data)
            this.createdOrderId = data;
        })

        this.orderGivinDate.setDate(this.orderGivinDate.getDate() + 2);
        
        this.isOrdered = true;
        
        this.cartService.clearCart();

        this.toastr.success ('Заказ успешно оформлен!', 'Оформление заказа', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
        });
      }
      else {
        var items: OrderItem[] = [];
        for (let i = 0; i < this.cartItems.length; i++) {
          items.push(new OrderItem(this.cartItems[i].idItem, this.cartItems[i].countItem));
        }

        let guest = new Guest((<HTMLInputElement>document.getElementById("inputName")).value,
                              (<HTMLInputElement>document.getElementById("inputEmail")).value,
                              (<HTMLInputElement>document.getElementById("inputPhone")).value);

        this.authService.createGuest(guest).toPromise()
        .then((data: number | undefined) => {
          if (data) {
            this.createdGuestId = data;
            console.log(data + "data");

            let ord = new OrderViewModel(-1, JSON.stringify(items), this.totalPrice, StatusId.checking, this.selectedLocationId, new Date(), true, data);

            this.orderService.createNewOrder(ord).toPromise()
            .then((data: number | undefined) => {
              if (data)
                this.createdOrderId = data;
            })

            this.orderGivinDate.setDate(this.orderGivinDate.getDate() + 2);
            
            this.isOrdered = true;
            
            this.cartService.clearCart();

            this.toastr.success ('Заказ успешно оформлен!', 'Оформление заказа', {
              timeOut: 5000,
              positionClass: 'toast-bottom-right',
            });        
          }
        });
      }
    }
  }

  back(): void {
    this.router.navigateByUrl("").then(() => {
      window.location.reload();
    });
  }
}
