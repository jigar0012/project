import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from '../helpers/validateform';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-forget-pw',
  templateUrl: './forget-pw.component.html',
  styleUrls: ['./forget-pw.component.scss']
})
export class ForgetPwComponent {

  forgetPassForm!: FormGroup;
  public resetPasswordEmail! : string
  public isValidEmail! : boolean
  

  constructor(private fb: FormBuilder, private route: Router, private toastr: ToastrService,private resetService: ResetPasswordService) {}
  ngOnInit(): void {
    this.forgetPassForm = this.fb.group({
      email: ['', [Validators.required, Validators.email ]],
    });

  }
  checkValidEmail(event: string){
    const value = event; 
    const pattern = /^[\w\.]+@([\w-]+\.)+[\w−]{2,10}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  get email(): FormControl {
    
    return this.forgetPassForm.get('email') as FormControl;
  }

  confirmToSend(){
    // if(this.forgetPassForm.valid){
    //   this.route.navigate(['rp'])
    //   this.toastr.success(`Email Sended`, "Success", {
    //     timeOut: 1500,
    //     easeTime: 100,
    //     progressBar: true,
    //     positionClass: 'toast-top-left'
    //   })
    // }else{
    //   ValidateForm.validateAllFormfields(this.forgetPassForm);
    //   this.toastr.error(``, "Failed", {
    //     timeOut: 1500,
    //     progressBar: true,
    //     progressAnimation: 'increasing',
    //     positionClass: 'toast-top-left'
    //   })
    // }
    if(this.checkValidEmail(this.resetPasswordEmail)){
      console.log(this.resetPasswordEmail);
      // this.resetPasswordEmail = "";
      this.resetService.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next: (res) =>{ 
          this.toastr.success(`Reset Succes`, "Sucess", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-left'
          });
          this.resetPasswordEmail = "";
        },
        error:(err)=>{
          this.toastr.error(`Something went wrong`, "Failed", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-left'
          })
        }
      })
    
    }
  }

 

}
