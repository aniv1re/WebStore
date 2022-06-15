import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.css']
})
export class CreateLocationComponent implements OnInit {

  constructor(private orderService: OrderService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private router: Router,
    private titlePage: Title) { 
    this.titlePage.setTitle("Добрая аптека - Создание точки выдачи" );
      if (this.tokenService.token.role != 'Admin')
        this.router.navigateByUrl("");
  }

  editLocation = new FormGroup({
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

  ngOnInit(): void { }

  createLocation(): void {
    if (this.editAddress?.value == "" || this.editCity?.value == "" || this.editWorkTime?.value == "" || this.editPhone?.value == "") {
      this.toastr.error('Заполните все поля ввода, чтобы продолжить!', 'Добавление данных', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else {
      this.orderService.createLocation(this.editLocation)
      .toPromise()
      .then(() => {
          this.router.navigateByUrl("/admin/panel").then(() => {
            this.toastr.success('Пункт выдачи товара успешно добавлен!', 'Добавление данных', {
              timeOut: 5000,
              positionClass: 'toast-bottom-right',
            });
          });
        }
      )
    }
  }
}

