import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private route: Router,private toastr: ToastrService){

  }

  canActivate(): boolean{
    if(this.auth.isLoggenIn()){
      return true
    }else {
      this.toastr.error(`'Please Login First`, "Failed", {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-left'
      })
      this.route.navigate([''])
      return false
    }
  }
    
  }
  
