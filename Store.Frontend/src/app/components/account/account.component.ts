import { Component, DoCheck, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';
import { Item } from 'src/app/models/item';
import { ItemCount } from 'src/app/models/itemCount';
import { Order } from 'src/app/models/order';
import { OrderItem } from 'src/app/models/orderItem';
import { User } from 'src/app/models/user';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public isOrders:boolean = false;
  public ph : string = "";
  public user$: ReplaySubject<User> = new ReplaySubject<User>();

  public passwordInputConfirm: string = "";

  public orders$: ReplaySubject<Order[]> = new ReplaySubject<Order[]>();
  public items$: ItemCount[] = [];
  public extractedItems$: Item[] = [];
  public ordersExists: boolean = false;

  public isAdmin: boolean = false;
  
  constructor(private router: Router,
    private tokenService: TokenService,
    private userService: UserService,
    private toastr: ToastrService,
    private title: Title,
    private orderService: OrderService,
    private itemService: ItemService) { 
      this.title.setTitle("Добрая аптека - Личный кабинет");
    }

  editUserForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
  });
  
  editPassForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get editPassword() { return this.editPassForm.get('password') }

  get editName() { return this.editUserForm.get('name') }
  get editSurname() { return this.editUserForm.get('surname') }
  get editPhone() { return this.editUserForm.get('phone') }

  @ViewChild('username') passElement: ElementRef | undefined;
  
  editPass(): void {
    this.passwordInputConfirm = (<HTMLInputElement>document.getElementById("pass")).value;

    if (this.editPassword?.value == "" || this.passwordInputConfirm == "") {
      this.toastr.error('Заполните поля ввода, чтобы продолжить!', 'Изменение данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else if (this.editPassword?.value != this.passwordInputConfirm) {
      this.toastr.error('Пароли не совпадают!', 'Изменение данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else { 
      this.userService.editUserPass(this.editPassForm).toPromise()
        this.toastr.success('Пароль успешно изменён!', 'Изменение данных', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
      });
    }
  }

  editUser(): void {
    if (this.editName?.value == '' || this.editSurname?.value == '' || this.editPhone?.value == '') {
      this.toastr.error('Заполните поля ввода, чтобы продолжить!', 'Изменение данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else {
      this.userService.editUser(this.editUserForm).toPromise()
        this.toastr.success('Контактные данные успешно изменены!', 'Изменение данных', {
          timeOut: 5000,
          positionClass: 'toast-bottom-right',
      });
    }
  }

  ngOnInit(): void {
    this.getUser();
    this.getOrders();

    if (this.tokenService.token.role == 'Admin')
      this.isAdmin = true;
  }

  getUser(): void {
    if (this.tokenService.token != null) {
      this.userService.getUser(this.tokenService.token.email).toPromise()
        .then((data: User | undefined) => {
          if (data) {
            this.user$.next(data); 
            this.editUserForm .setValue({
              name: data.name,
              surname: data.surname,
              phone: data.phone,
              email: data.email,
            });
            this.editPassForm .setValue({
              email: data.email,
              password: ''
            });
        }
      })
    }
  }

  logout(): void {
    this.editUserForm .setValue({
      name: '',
      surname: '',
      phone: '',
      email: '',
    });
    this.editPassForm .setValue({
      email: '',
      password: ''
    });
    this.tokenService.remove();

    this.router.navigateByUrl("/").then(() => {window.location.reload();});
    
  }

  authU(): void {
    this.isOrders = false;
  }

  orders(): void {
    this.isOrders = true;
  }

  getOrders(): void {
    this.orderService.getUserOrders(this.tokenService.token.id).toPromise()
    .then((data: Order[] | undefined) => {
      if (data) {
        if (data.length > 0)
          this.ordersExists = true;
        // Все заказы
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
                this.items$.push(new ItemCount(i, dataItem, extractItemsArrayParsed[j].count));
              }
            });
          }        
        }
      }
    });
  }

  getStatus(id: number): string {
    switch(id){
      case 2:
        return 'Проверяется';
        break;
      case 4:
        return 'Принят в работу';
        break;
      case 8:
        return 'Получен';
        break;
      default:
        return 'Проверяется';
        break;
    }
  }

  roudTotalPrice(price: number): any {
    return price.toFixed(2);
  }
}
