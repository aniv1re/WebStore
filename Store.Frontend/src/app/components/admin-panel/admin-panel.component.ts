import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Item } from 'src/app/models/item';
import { ItemCount } from 'src/app/models/itemCount';
import { MapItem } from 'src/app/models/mapItem';
import { Order } from 'src/app/models/order';
import { OrderItem } from 'src/app/models/orderItem';
import { User } from 'src/app/models/user';
import { UserExt } from 'src/app/models/userExt';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  public selectedAction: string = '';
  public items$: ReplaySubject<Item[]> = new ReplaySubject<Item[]>();
  public orders$: ReplaySubject<Order[]> = new ReplaySubject<Order[]>();
  public locations$: ReplaySubject<MapItem[]> = new ReplaySubject<MapItem[]>();
  public users$: UserExt[] = [];

  public tempUser: string = "";

  constructor(private tokenService: TokenService,
    private router: Router,
    private itemService: ItemService,
    private orderService: OrderService,
    private userService: UserService) { 
    if (this.tokenService.token.role != 'Admin')
      this.router.navigateByUrl("");
   }

  ngOnInit(): void {
    this.loadUsers();
    this.loadOrders();
    this.loadItems();
    this.loadLocations();
  }

  getStatus(id: number): string {
    switch(id){
      case 2:
        return 'Проверяется';
        break;
      case 4:
        return 'Принято';
        break;
      case 8:
        return 'Получено';
        break;
      default:
        return 'Проверяется';
        break;
    }
  }

  getRole(id: number): string {
    console.log(id);
    
    if (id == 1) 
      return 'Администратор';
    else 
      return 'Пользователь'
  }

  getUser(id: number): string {
    let temp: string = "";
 
    for (let i = 0; i < this.users$.length; i++) {
      if (id == this.users$[i].id)
        temp = this.users$[i].phone;
    }

    return temp;
  }

  selectItemsList(): void {
    this.selectedAction = 'items';
  }

  public itemsInOrder$: ItemCount[] = [];

  selectOrdersList(): void {
    this.selectedAction = 'orders';
  }

  selectUsersList(): void {
    this.selectedAction = 'users';
  }

  loadUsers(): void {
    this.userService.getAllUsers()
    .toPromise()
    .then((data: UserExt[] | undefined) => {
      if (data)
        for (let i = 0; i < data.length; i++) {
          this.users$.push(data[i]);
          
        }
    })
  }

  loadItems(): void {
    this.itemService.getAllItems()
    .toPromise()
    .then((data: Item[] | undefined) => {
      if (data)
        this.items$.next(data);
    })
  }

  loadOrders(): void {
    this.orderService.getAllOrders()
    .toPromise()
    .then((data: Order[] | undefined) => {
      if (data) {
        this.orders$.next(data);

        // Вытаскиваем отдельно для каждого заказа массив всех товаров с количеством
        for (let i = 0; i < data.length; i++) {
          let extractItemsArray = data[i].items;
          
          // Парсим в массив
          let extractItemsArrayParsed: OrderItem[] = JSON.parse(extractItemsArray);
          
          for (let j = 0; j < extractItemsArrayParsed.length; j++) {
            this.itemService.getItemById(extractItemsArrayParsed[j].itemId)
            .toPromise()
            .then((dataItem: any | undefined) => {
              if (dataItem) {
                this.itemsInOrder$.push(new ItemCount(i, dataItem, extractItemsArrayParsed[j].count));
              }
            });
          }        
        }
      }
    })
  }

  selectItemLocationsPoint(): void {
    this.selectedAction = 'locations';
  }

  loadLocations(): void {
    this.orderService.getAllLocations()
    .toPromise()
    .then((data: MapItem[] | undefined) => {
      if (data)
        this.locations$.next(data);
    })
  }

  refresh(): void {
    window.location.reload();
  }

  // public 

  // orderContains(): void {
  //   // this.orderService.getUserOrders(this.tokenService.token.id).toPromise()
  //   // .then((data: Order[] | undefined) => {
  //   //   if (data) {
  //   //     // Все заказы
  //       this.orders$;

        
  //     }
  //   });
  // }
}
