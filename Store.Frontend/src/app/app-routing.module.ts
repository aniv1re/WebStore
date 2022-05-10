import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { AuthComponent } from './components/auth/auth.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AuthGuard } from './components/guard/auth.guard';
import { ItemPageComponent } from './components/item-page/item-page.component';
import { MainComponent } from './components/main/main.component';
import { SearchCategoriesItemsComponent } from './components/search-categories-items/search-categories-items.component';
import { SearchItemsComponent } from './components/search-items/search-items.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  { path: 'auth', component: AuthComponent },
  { path: 'catalog/:id', component: ItemPageComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/search', component: SearchCategoriesItemsComponent },
  { path: 'search/:name', component: SearchItemsComponent },


  // { path: '1-allergiya', component: SearchCategoriesItemsComponent },
  // { path: '2-gripp-prostuda-orz', component: SearchCategoriesItemsComponent },
  // { path: '3-recepturnye-tovary', component: SearchCategoriesItemsComponent },
  // { path: '4-sustavy-i-myshcy', component: SearchCategoriesItemsComponent },
  // { path: '5-vitaminy-i-bady', component: SearchCategoriesItemsComponent },
  // { path: '6-dermatologiya', component: SearchCategoriesItemsComponent },
  // { path: '7-nevrologiya', component: SearchCategoriesItemsComponent },
  // { path: '8-zhenskoe-zdoroye', component: SearchCategoriesItemsComponent },
  // { path: '9-zheludok-kishechnik-i-pechen', component: SearchCategoriesItemsComponent },
  // { path: '10-gigiena', component: SearchCategoriesItemsComponent },
  // { path: '11-zabolevaniya-ven', component: SearchCategoriesItemsComponent },
  // { path: '12-kosmetika', component: SearchCategoriesItemsComponent },
  // { path: '13-mama-i-malysh', component: SearchCategoriesItemsComponent },
  // { path: '14-urologiya-i-nefrologiya', component: SearchCategoriesItemsComponent },
  // { path: '15-med-tekhnika', component: SearchCategoriesItemsComponent },
  // { path: '16-lechenie-organov-sluha-i-zreniya', component: SearchCategoriesItemsComponent },
  // { path: '17-perevyazka-i-med-izdeliya', component: SearchCategoriesItemsComponent },
  // { path: '18-bol-i-temperatura', component: SearchCategoriesItemsComponent },
  // { path: '19-travy', component: SearchCategoriesItemsComponent },
  // { path: '20-aromaterapiya', component: SearchCategoriesItemsComponent },
  // { path: '21-sezonnye-tovary', component: SearchCategoriesItemsComponent },
  // { path: '22-optika', component: SearchCategoriesItemsComponent },
  // { path: '23-produkty-pitaniya', component: SearchCategoriesItemsComponent },
  // { path: '24-pohudenie', component: SearchCategoriesItemsComponent },
  // { path: '25-raznoe', component: SearchCategoriesItemsComponent },
  // { path: '26-ortopediya', component: SearchCategoriesItemsComponent },
  // { path: '27-gomeopatiya', component: SearchCategoriesItemsComponent },
  // { path: '28-vrednye-privychki', component: SearchCategoriesItemsComponent },
  // { path: '28-intimnye-otnosheniya', component: SearchCategoriesItemsComponent },

  { path: '**', component: MainComponent },
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
