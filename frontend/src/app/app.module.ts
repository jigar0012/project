import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ForgetPwComponent } from './components/forget-pw/forget-pw.component';
import { ResetPwComponent } from './components/reset-pw/reset-pw.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http'
import { TokenInterceptor } from './interceptor/token.interceptor';
import { UserComponent } from './components/user/user.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalComponent } from './modal/modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    DashboardComponent,
    ForgetPwComponent,
    ResetPwComponent,
    UserComponent,
    ModalComponent,

  

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    Ng2TelInputModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MdbModalModule,
    ModalModule,
    NgChartsModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
