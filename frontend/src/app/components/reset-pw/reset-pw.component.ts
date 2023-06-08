import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from '../helpers/validateform';
import { ResetPassword } from 'src/app/Models/reset-password.model';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset-pw',
  templateUrl: './reset-pw.component.html',
  styleUrls: ['./reset-pw.component.scss']
})
export class ResetPwComponent {

  resetPassForm!: FormGroup;
  emailToReset! : string;
  emailToken! : string;
  resetPasswordObj = new ResetPassword();

  constructor(private fb: FormBuilder,private activatedRoute : ActivatedRoute, private route: Router, private toastr: ToastrService, private resetService: ResetPasswordService) {}
  ngOnInit(): void {
    this.resetPassForm = this.fb.group({
      password: ["",[Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      confirmPassword: ["",[Validators.required]],
    });

    this.activatedRoute.queryParams.subscribe(val =>{
      this.emailToReset = val['email'];
      let uriToken = val['code']
      this.emailToken = uriToken.replace(/ /g, '+');
      console.log(this.emailToken);
      console.log(this.emailToReset);
    })

  }


  get password(): FormControl {
    return this.resetPassForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.resetPassForm.get('confirmPassword') as FormControl;
  }

  onsubmit(){
    if(this.resetPassForm.valid && this.password.value == this.confirmPassword.value){
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.password = this.resetPassForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPassForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetService.resetPassword(this.resetPasswordObj)
      .subscribe({
        next: (res)=>{
          this.toastr.success(`Password Changed`, "Success", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-left'
          })
          this.route.navigate([''])
        },
        error: (err)=>{
         
          this.toastr.error(`Something went Wrong`, "Failed", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-left'
          })
        }
      })  
    }else{
      ValidateForm.validateAllFormfields(this.resetPassForm);
    }
  }

}
