import { Component, OnInit, Type } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient,HttpEventType, HttpHeaders, HttpResponse  } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

  id:any;
  data: any;
  email:any;
  user: any;
  public fullName : string = "";
  selectedFile!: File;
  public progress!: number;
  public message!: string;
  adminId!: number 


private baseURL:string='https://localhost:7219/api/User/'
  

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private http: HttpClient,
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router
  ) { }

  signout(){
    this.auth.signOut();
  }



  ngOnInit() {
    this.api.getUsers().subscribe(res => {
      this.user = res;
      this.getAdminId();
    });
  
    this.id = this.route.snapshot.params['id'];
    this.getOne();
  
    if (this.route.snapshot.params['email']) {
      this.email = this.route.snapshot.params['email'];
      this.getEmail();
    }
  }
  
  
  getAdminId() {
    for (const user of this.user) {
      const fullName = `${user.fname} ${user.lname}`;
      if (user.role === 'Admin' && fullName === this.fullName) {
        this.adminId = user.id;
        console.log('adminId:', this.adminId);
        break;
      }
    }
  }
  
  getEmail() {
    this.api.getUserByEmail(this.email).subscribe(data => {
      this.data = data;
      console.log(this.data);
    });
  }
  
  getOne() {
    this.api.getOne(this.id).subscribe(data => {
      this.data = data;
      console.log(this.data);
    });
  }
  
editProfileForm = new FormGroup({
  fname: new FormControl(''),
  lname: new FormControl(''),
  email: new FormControl(''),
  dob: new FormControl(''),
  gender: new FormControl(''),
  phonenum: new FormControl(''),
  address: new FormControl(''),
  country: new FormControl(''),
  state: new FormControl(''),
  city: new FormControl('')
});
editProfileForm2 = new FormGroup({
pfp: new FormControl('')
});

pfpValue: File | undefined;
 // Handle the file input change event
 onFileSelected(event: any) {
  this.pfpValue = event.target.files[0];
}

onSubmit() {
  // Update the user object with the form data
  const user = { ...this.data, ...this.editProfileForm.value };

  if (this.pfpValue) {
    const formData = new FormData();
    formData.append('file', this.pfpValue);

    this.http.post<any>(`${this.baseURL}users/upload`, formData).subscribe(
      (response) => {
        // Update user object with the new image filename
        user.pfp = `https://localhost:7219/Resources/Images/${response.fileName}`;

        this.updateUser(user);
      },
      (error) => {
        console.error(error);
      }
    );
  } else {
    this.updateUser(user);
  }
}
onSubmit2() {
  // Update the user object with the form data
  const user = { ...this.data, ...this.editProfileForm2.value };

  if (this.pfpValue) {
    const formData = new FormData();
    formData.append('file', this.pfpValue);

    this.http.post<any>(`${this.baseURL}users/upload`, formData).subscribe(
      (response) => {
        // Update user object with the new image filename
        user.pfp = `https://localhost:7219/Resources/Images/${response.fileName}`;

        this.updateUser(user);
      },
      (error) => {
        console.error(error);
      }
    );
  } else {
    this.updateUser(user);
  }


}



private updateUser(user: any) {
  this.api.updateData(user).subscribe(
    (response) => {
      console.log('PUT request was successful');
      // Update the data in the component instead of reloading the page
      this.data = user;
      this.toastr.success('Profile updated successfully.', '', {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-left'
      });
    },
    (error) => {
      console.error('Error occurred while updating profile:', error);
      this.toastr.error('An error occurred while updating profile.', '', {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-left'
      });
    }
  );
}

openModal(exampleModal: any, user: any) {
  this.editProfileForm.patchValue(user);
}

openModal2(exampleModal: any, user: any) {
  this.editProfileForm2.patchValue(user);
}
}

