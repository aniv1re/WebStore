import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AuthComponent } from './components/auth/auth.component';
import { CartComponent } from './components/cart/cart.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CompanyComponent } from './components/company/company.component';
import { AuthGuard } from './components/guard/auth.guard';
import { ItemPageComponent } from './components/item-page/item-page.component';
import { MainComponent } from './components/main/main.component';
import { OrderComponent } from './components/order/order.component';
import { SearchCategoriesItemsComponent } from './components/search-categories-items/search-categories-items.component';
import { SearchItemsComponent } from './components/search-items/search-items.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  { path: 'auth', component: AuthComponent },
  { path: 'admin/panel', component: AdminPanelComponent, canActivate: [AuthGuard]},
  { path: 'catalog/:id', component: ItemPageComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/search', component: SearchCategoriesItemsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'cart/order', component: OrderComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'search/:name', component: SearchItemsComponent },
  { path: '**', component: MainComponent },
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
