import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Guest } from 'src/app/models/guest';
import { GuestExt } from 'src/app/models/guestExt';
import { ItemCount } from 'src/app/models/itemCount';
import { MapItem } from 'src/app/models/mapItem';
import { Order } from 'src/app/models/order';
import { OrderItem } from 'src/app/models/orderItem';
import { User } from 'src/app/models/user';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {
  public order$: Order | undefined;
  public itemsInOrder$: ItemCount[] = [];
  public userData: string[] = [];
  public guestData: string[] = [];
  public selectedOrderStatus: any;
  public location: string = "";
  public ordersStatus: any[];

  constructor(private orderService: OrderService,
    private tokenService: TokenService,
    private actRouter: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private userService: UserService,
    private toastr: ToastrService,
    private titlePage: Title) { 
    this.titlePage.setTitle("Добрая аптека - Статус заказа" );
    if (this.tokenService.token.role != 'Admin')
        this.router.navigateByUrl("");

    this.ordersStatus = [
    {name: 'Проверяется', value: 2},
    {name: 'Принят в работу', value: 4},
    {name: 'Получен', value: 8}]
  }

  ngOnInit(): void {
    this.actRouter.params.subscribe(
    (data: Params) => {
      let id: number = +data['id']
      this.loadOrder(id);
    });
  }

  saveStatus(): void {
    if (this.order$) {
      this.orderService.editOrderStatus(this.order$.id, this.selectedOrderStatus.value)
      .toPromise()
      .then(() => {
        this.router.navigateByUrl("/admin/panel")
        .then(() => {
          this.toastr.success('Статус выбранного заказа успешно изменён', 'Изменение статуса заказа', {
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
          });
        });
      });
    }
  }

  loadOrder(id: number): void {
    this.orderService.getOrderById(id)
    .toPromise()
    .then((data: Order | undefined) => {
      if (data) {
        this.order$ = data;

        let extractItemsArray = data.items;
          
        // Парсим в массив
        let extractItemsArrayParsed: OrderItem[] = JSON.parse(extractItemsArray);
        
        for (let j = 0; j < extractItemsArrayParsed.length; j++) {
          this.itemService.getItemById(extractItemsArrayParsed[j].itemId)
          .toPromise()
          .then((dataItem: any | undefined) => {
            if (dataItem) {
              this.itemsInOrder$.push(new ItemCount(1, dataItem, extractItemsArrayParsed[j].count));
            }
          });
        }   
        
        if (!data.isGuest) {
          this.userService.getUserById(data.userId)
          .toPromise()
          .then((dataD: User | undefined) => {
            if (dataD) {
              this.userData[0] = dataD.name + " " + dataD.surname;
              this.userData[1] = dataD.email;
              this.userData[2] = dataD.phone;
            }
          });
        }
        else {
          this.userService.getGuest(data.guestId)
          .toPromise()
          .then((dataD: Guest | undefined) => {
            if (dataD) {
              this.guestData[0] = dataD.name;
              this.guestData[1] = dataD.email;
              this.guestData[2] = dataD.phone;
            }
          });
        }

        this.orderService.getLocationById(data.mapItemId)
        .toPromise()
        .then((dataD: MapItem | undefined) => {
          if (dataD) {
            this.location = dataD.city + ", " + dataD.address
          }
        })

        switch(this.order$?.statusId) {
          case 2: {
            this.selectedOrderStatus = {name: 'Проверяется', value: 2};
            break;
          }
          case 4: {
            this.selectedOrderStatus = {name: 'Принят в работу', value: 4};
            break;
          }
          case 8: {
            this.selectedOrderStatus = {name: 'Получен', value: 8};
            break;
          }
        }
      }
    })
  }
}
