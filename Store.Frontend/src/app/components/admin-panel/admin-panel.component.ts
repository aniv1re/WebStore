import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Guest } from 'src/app/models/guest';
import { GuestExt } from 'src/app/models/guestExt';
import { Item } from 'src/app/models/item';
import { ItemCount } from 'src/app/models/itemCount';
import { MapItem } from 'src/app/models/mapItem';
import { News } from 'src/app/models/news';
import { Order } from 'src/app/models/order';
import { OrderItem } from 'src/app/models/orderItem';
import { UserExt } from 'src/app/models/userExt';
import { ItemService } from 'src/app/services/item.service';
import { NewsService } from 'src/app/services/news.service';
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
  public orders$: Order[] = [];
  public locations$: ReplaySubject<MapItem[]> = new ReplaySubject<MapItem[]>();
  public news$: ReplaySubject<News[]> = new ReplaySubject<News[]>();
  public users$: UserExt[] = [];
  public guests$: GuestExt[] = [];
  public adminId: number = -1;

  public tempUser: string = "";

  constructor(private tokenService: TokenService,
    private router: Router,
    private itemService: ItemService,
    private orderService: OrderService,
    private userService: UserService,
    private newsService: NewsService,
    private toastr: ToastrService,
    private title: Title) { 
    this.title.setTitle("Добрая аптека - Панель администратора" ); 
    if (this.tokenService.token.role != 'Admin')
      this.router.navigateByUrl("");
   }

  ngOnInit(): void {
    this.loadOrders();
    this.loadUsers();
    this.loadGuests();
    this.loadItems();
    this.loadLocations();
    this.loadNews();
    this.adminId = this.tokenService.token.id;
  }

  getStatus(id: number): string {
    switch(id){
      case 2:
        return 'Проверяется';
      case 4:
        return 'Принят в работу';
      case 8:
        return 'Получен';
      default:
        return 'Проверяется';
    }
  }

  getRole(id: number): string {
    if (id == 1) 
      return 'Администратор';
    else 
      return 'Пользователь'
  }

  getUser(id: number): string {
    let temp: string = "";
 
    for (let i = 0; i < this.users$.length; i++) {
      if (id == this.users$[i].id)
        temp = this.users$[i].phone + " " + this.users$[i].email;
    }

    return temp;
  }

  getGuest(id: number): string {
    let temp: string = "";

    for (let i = 0; i < this.guests$.length; i++) {
      if (id == this.guests$[i].id) {
        temp = this.guests$[i].phone + " " + this.guests$[i].email;
      }
    }

    return temp;
  }

  loadGuests(): void {
    this.userService.getAllGuests()
    .toPromise()
    .then((data: GuestExt[] | undefined) => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          this.guests$.push(data[i]);
        }
      }
    })
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
        for (let i = 0; i < data.length; i++) {
          this.orders$.push(data[i]);
        }

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
    });
  }

  selectItemLocationsPoint(): void {
    this.selectedAction = 'locations';
  }
  
  selectNewsList(): void {
    this.selectedAction = 'news';
  }

  loadLocations(): void {
    this.orderService.getAllLocations()
    .toPromise()
    .then((data: MapItem[] | undefined) => {
      if (data)
        this.locations$.next(data);
    });
  }

  loadNews(): void {
    this.newsService.getAllNews()
    .toPromise()
    .then((data: News[] | undefined) => {
      if (data) {
        this.news$.next(data);
      }
    });
  }

  refresh(): void {
    window.location.reload();
  }

  deleteLocation(id: number): void {
    this.orderService.deleteLocationById(id)
    .toPromise()
    .then(() => {
      this.toastr.success('Выбранный пункт выдачи успешно удалён!', 'Удаление данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
      window.location.reload();
    });
  }

  deleteItem(id: number): void {
    this.itemService.deleteItemById(id)
    .toPromise()
    .then(() => {
      this.toastr.success('Выбранный товар успешно удалён!', 'Удаление данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
      window.location.reload();
    });
  }

  deleteOrder(id: number): void {
    this.orderService.deleteOrderById(id)
    .toPromise()
    .then(() => {
      this.toastr.success('Заказ успешно удалён', 'Удаление заказа', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
      window.location.reload();
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id)
    .toPromise()
    .then(() => {
      this.toastr.success('Выбранный пользователь успешно удалён!', 'Удаление данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
      window.location.reload();
    });
  }

  deleteNews(id: number): void {
    this.newsService.deleteNewsById(id)
    .toPromise()
    .then(() => {
      this.toastr.success('Выбранная новость успешно удалена!', 'Удаление данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
      window.location.reload();
    });
  }
}
