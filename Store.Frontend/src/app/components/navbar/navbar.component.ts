import { ChangeDetectionStrategy, Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserToken } from 'src/app/models/userToken';
import { CartService } from 'src/app/services/cart.service';
import { LocationService } from 'src/app/services/location.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit, DoCheck {
  public loggedUser: string = '';
  public isUserLogged: boolean | undefined;
  public searchText: string | undefined;
  public cartItemsCount: string = "";
  public userLocation: string = "";
  private readonly token: UserToken;
  
  constructor(private tokenService: TokenService,
    private toastr: ToastrService,
    private router: Router,
    private cartService: CartService,
    private locationService: LocationService) { this.token = tokenService.token; }

  ngOnInit(): void {
    this.isLogged();
    if (localStorage.getItem('token') !== null) {
      this.loggedUser = this.token.email;
    }

    this.getCartItemsData();

    this.userLocation = this.locationService.getUserLocation() == "" || this.locationService.getUserLocation() == undefined ? "Архангельск" : this.locationService.getUserLocation();

    if (this.locationService.getUserLocation() == "" || this.locationService.getUserLocation() == undefined) {
      this.locationService.setUserLocation("Архангельск");
    }
  }

  ngDoCheck(): void {
    this.isLogged();
    this.getCartItemsData();
  }

  setLocation(location: string): void {
    this.locationService.setUserLocation(location);
    window.location.reload();
  }

  getCartItemsData(): void {
    this.cartItemsCount = this.cartService.getCartItemsCount();
  }

  isLogged(): void {
    if (localStorage.getItem('token') !== null) {
      this.isUserLogged = false;
    }
    else {
      this.isUserLogged = true;
    }
  }

  searchItems(): void {
    this.searchText = (<HTMLInputElement>document.getElementById("searchText")).value;
    if (this.searchText == '' || this.searchText.length < 3) {
      this.toastr.error('Название лекарственного средство должно быть не меньше 3-ёх символов!', 'Поиск', {
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
      });
    }
    else {
      this.router.navigateByUrl("search/" + this.searchText).then(() => {
        window.location.reload();
      });
    }
  }

  moveToCart(): void {
    this.router.navigateByUrl("/cart").then(() => {
      window.location.reload();
    });
  }

}
