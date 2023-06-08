import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from '../helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email ]],
      password: ['',[Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    });
  

  }

  loginForm!: FormGroup;
  showPassword: boolean = false;
  
  constructor(private fb: FormBuilder,private resetService: ResetPasswordService, private route: Router, private toastr: ToastrService, private auth: AuthService
    ,private userStore: UserStoreService,private api: ApiService,private router: ActivatedRoute) {}
    
    
    
    
    get email(): FormControl {
      this.userEmail = this.loginForm.get('email')?.value;
      return this.loginForm.get('email') as FormControl;
      
      
    }
    
    get password(): FormControl {
      return this.loginForm.get('password') as FormControl;
    }
    
    
    public togglePassword() {
      this.showPassword = !this.showPassword;
    }
  

  public role : string = "";
  id:any;
  data: any;
  Email: any;
  public User:any = [];
  userEmail: string ='';

  onLogin(){
    const email = this.loginForm.get('email')?.value;

    if(this.loginForm.valid){
      // send obj to database
      this.auth.Login(this.loginForm.value).subscribe({
        next:(res)=>{ 
          console.log(res.message);
          this.loginForm.reset();
          this.auth.storeToken(res.token);
          const tokenPayload = this.auth.decodeToken();
          this.role = tokenPayload.role;
          this.userStore.setFullNameForStore(tokenPayload.name);
          this.userStore.setRoleForStore(tokenPayload.role);
          this.toastr.success(res.message, "Success", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-left'
          });
          if(this.role === 'Admin'){
            this.route.navigate(['dash']);    
          } else {
            const userEmail = this.loginForm.get('email')?.value;
            if (email) {
              this.route.navigate(['email/' + email]);
              console.log(email);
            }
            this.route.navigate(['email', userEmail]);
          }    
        },
        error:(err)=>{
          console.log(err);
          if (err.error && err.error.message === 'Invalid password') {
            this.toastr.error('Invalid password', "Failed", {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-left'
            });
          } else {
            this.toastr.error(err.error.message || 'An error occurred', "Failed", {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-left'
            });
            // Handle other error scenarios here
          }
        }
      });    
    } else {
      ValidateForm.validateAllFormfields(this.loginForm);
    }
  }
  
  
  
  

}
