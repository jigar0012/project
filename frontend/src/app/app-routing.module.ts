import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgetPwComponent } from './components/forget-pw/forget-pw.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ResetPwComponent } from './components/reset-pw/reset-pw.component';
import {AuthGuard} from './guards/auth.guard'
import { UserComponent } from './components/user/user.component';
const routes: Routes = [
  {
    path: '', component: LoginComponent
  },

  {
    path:"reg", component: RegistrationComponent
  },
  {
    path: 'dash',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dash/user/:id',
        component: UserComponent,
      },
    ],
  },
  {
    path:'fp', component: ForgetPwComponent
  },
  {
    path:'rp', component: ResetPwComponent
  },
  {
    path:'dash/user/:id', component: UserComponent, canActivate: [AuthGuard]
  },
  {
    path: 'dash/user',
    component: UserComponent,
    canActivate: [AuthGuard]
  }
,
  
  {
    path:'email/:email', component: UserComponent,
  }
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  
})
export class AppRoutingModule { }
