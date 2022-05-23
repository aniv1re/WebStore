import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AccountComponent } from './components/account/account.component';
import { AuthInterceptor } from './components/guard/auth.interceptor';
import { InputMaskModule } from 'primeng/inputmask';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { CategoriesComponent } from './components/categories/categories.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { TagModule } from 'primeng/tag';
import { ItemPageComponent } from './components/item-page/item-page.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { SearchItemsComponent } from './components/search-items/search-items.component';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { SliderModule } from 'primeng/slider';
import { DropdownModule } from 'primeng/dropdown';
import { NgpSortModule } from "ngp-sort-pipe";
import { SearchCategoriesItemsComponent } from './components/search-categories-items/search-categories-items.component';
import { CartComponent } from './components/cart/cart.component';
import { BadgeModule } from 'primeng/badge';
import { OrderComponent } from './components/order/order.component';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CompanyComponent } from './components/company/company.component';
import { CarouselModule } from 'primeng/carousel';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AuthComponent,
    AccountComponent,
    CategoriesComponent,
    FooterComponent,
    MainComponent,
    ItemPageComponent,
    SearchItemsComponent,
    SearchCategoriesItemsComponent,
    CartComponent,
    OrderComponent,
    AdminPanelComponent,
    CompanyComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastModule,
    InputMaskModule,
    NgxMaskModule.forRoot(maskConfig),
    ToastrModule.forRoot(),
    TagModule,
    InputNumberModule,
    ImageModule,
    SkeletonModule,
    SliderModule,
    DropdownModule,
    NgpSortModule,
    BadgeModule,
    DividerModule,
    PanelModule,
    CarouselModule
  ],
  providers: [ MessageService,
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
    
    
  
  bootstrap: [AppComponent]
})
export class AppModule { }
