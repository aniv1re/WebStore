import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { AuthComponent } from './components/auth/auth.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AuthGuard } from './components/guard/auth.guard';

import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  {path: '', component: MainComponent },
  {path: 'auth', component: AuthComponent },
  {path: 'categories', component: CategoriesComponent },
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
