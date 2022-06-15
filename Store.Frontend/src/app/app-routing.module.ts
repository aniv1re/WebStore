import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CreateItemComponent } from './components/admin/create-item/create-item.component';
import { CreateLocationComponent } from './components/admin/create-location/create-location.component';
import { CreateNewsComponent } from './components/admin/create-news/create-news.component';
import { EditItemComponent } from './components/admin/edit-item/edit-item.component';
import { EditLocationComponent } from './components/admin/edit-location/edit-location.component';
import { EditOrderComponent } from './components/admin/edit-order/edit-order.component';
import { EditUserComponent } from './components/admin/edit-user/edit-user.component';
import { AuthComponent } from './components/auth/auth.component';
import { CartComponent } from './components/cart/cart.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CompanyComponent } from './components/company/company.component';
import { AuthGuard } from './components/guard/auth.guard';
import { ItemPageComponent } from './components/item-page/item-page.component';
import { MainComponent } from './components/main/main.component';
import { NewsArchiveComponent } from './components/news-archive/news-archive.component';
import { NewsPageComponent } from './components/news-page/news-page.component';
import { OrderComponent } from './components/order/order.component';
import { OurLocationPageComponent } from './components/our-location-page/our-location-page.component';
import { SearchCategoriesItemsComponent } from './components/search-categories-items/search-categories-items.component';
import { SearchItemsComponent } from './components/search-items/search-items.component';
import { UserAgreementComponent } from './components/user-agreement/user-agreement.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  { path: 'auth', component: AuthComponent },

  { path: 'admin/panel', component: AdminPanelComponent, canActivate: [AuthGuard]},
  { path: 'admin/panel/create/location', component: CreateLocationComponent, canActivate: [AuthGuard]},
  { path: 'admin/panel/create/news', component: CreateNewsComponent, canActivate: [AuthGuard]},
  { path: 'admin/panel/create/item', component: CreateItemComponent, canActivate: [AuthGuard]},
  { path: 'admin/panel/edit/location/:id', component: EditLocationComponent, canActivate: [AuthGuard]},
  { path: 'admin/panel/edit/user/:id', component: EditUserComponent, canActivate: [AuthGuard]},
  { path: 'admin/panel/edit/order/:id', component: EditOrderComponent, canActivate: [AuthGuard]},
  { path: 'admin/panel/edit/item/:id', component: EditItemComponent, canActivate: [AuthGuard]},

  { path: 'catalog/:id', component: ItemPageComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/search', component: SearchCategoriesItemsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'cart/order', component: OrderComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'search/:name', component: SearchItemsComponent },
  { path: 'news/archive/:id', component: NewsPageComponent },
  { path: 'news/archive', component: NewsArchiveComponent },
  { path: 'user-agreement', component: UserAgreementComponent },
  { path: 'contacts', component: OurLocationPageComponent },
  { path: '**', component: MainComponent },
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
