import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./helpers/auth.guard";

const accountModule = () => import('./account/account.module').then(x => x.AccountModule)
const userModule = () => import('./users/users.module').then(x => x.UsersModule)

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'users', loadChildren: accountModule, canActivate:[AuthGuard] },
  { path: 'account', loadChildren: userModule },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
