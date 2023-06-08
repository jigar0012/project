import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService} from "@auth0/angular-jwt"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;

  

  private baseURL:String ='https://localhost:7219/api/User/'
 private userPayload : any;
 
  constructor(private http: HttpClient,private route: Router) { 
    this.userPayload = this.decodeToken();
  }

  signUp(UserObj: any):Observable<any>{
    return this.http.post(`${this.baseURL}register`,UserObj)
    
  }



  signOut(){
    localStorage.clear();
    this.route.navigate([''])
  }
  

  Login(LoginObj: any):Observable<any>{
    return this.http.post(`${this.baseURL}authenticate`,LoginObj)
    
  }

  storeToken(tokenValue : string){
    localStorage.setItem('token', tokenValue)
  }

  getToken(){
    return localStorage.getItem('token')
  }

  isLoggenIn(): boolean{
    return !!localStorage.getItem('token')
  }

  decodeToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToken(){
    if(this.userPayload)
    return this.userPayload.name;
  }

  getRoleFromToken(){
    if(this.userPayload)
    return this.userPayload.role;
  }

}
