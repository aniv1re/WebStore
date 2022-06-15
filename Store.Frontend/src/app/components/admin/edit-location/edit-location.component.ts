import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { MapItem } from 'src/app/models/mapItem';
import { LocationService } from 'src/app/services/location.service';
import { OrderService } from 'src/app/services/order.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.css']
})
export class EditLocationComponent implements OnInit {
  public locationId: number = 0;
  public location$: MapItem | undefined;

  constructor(private orderService: OrderService,
    private actRouter: ActivatedRoute,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private router: Router,
    private titlePage: Title) { 
    this.titlePage.setTitle("Добрая аптека - Редактирование точки выдачи товара" );
      if (this.tokenService.token.role != 'Admin')
        this.router.navigateByUrl("");
  }

  editLocation = new FormGroup({
    id: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    workTime: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
  });

  get editAddress() { return this.editLocation.get('address') }
  get getId() { return this.editLocation.get('id') }
  get editCity() { return this.editLocation.get('city') }
  get editWorkTime() { return this.editLocation.get('workTime') }
  get editPhone() { return this.editLocation.get('phone') }

  ngOnInit(): void {
    this.actRouter.params.subscribe(
    (data: Params) => {
      let id: number = +data['id']
      this.getLocation(id);
    });
  }

  getLocation(id: number): void {
    this.orderService.getLocationById(id)
    .toPromise()
    .then((data: MapItem | undefined) => {
      if (data) {
        this.location$ = data; 
        this.editLocation.setValue({
          id: data.id,
          address: data.address,
          city: data.city,
          phone: data.phone,
          workTime: data.workTime,
        });
      }
    });
  }

  saveLocationData(): void {
    if (this.editAddress?.value == "" || this.editCity?.value == "" || this.editWorkTime?.value == "" || this.editPhone?.value == "") {
      this.toastr.error('Заполните все поля ввода, чтобы продолжить!', 'Изменение данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else {
      this.orderService.editLocation(this.editLocation)
      .toPromise()
      .then(() => {
          this.router.navigateByUrl("/admin/panel").then(() => {
            this.toastr.success('Пункт выдачи товара успешно изменён!', 'Изменение данных', {
              timeOut: 5000,
              positionClass: 'toast-bottom-right',
            });
          });
        }
      )
    }
  }
}
