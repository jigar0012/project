import { Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { City, Country, State } from 'country-state-city';
import ValidateForm from '../helpers/validateform';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit  {

  resetForm() {
    this.registerForm.reset();
  }

  @ViewChild('country') country: ElementRef | any
@ViewChild('city') city: ElementRef | any
@ViewChild('state') state: ElementRef | any
name = 'Angular ' + VERSION.major;
countries = Country.getAllCountries();
states: any = null;
cities: any = null;

selectedCountry: undefined | null;
selectedState: undefined | null;
selectedCity: undefined | null;

onCountryChange($event: any): void {
  this.states = State.getStatesOfCountry(JSON.parse(this.country.nativeElement.value).isoCode);
  this.selectedCountry =JSON.parse(this.country.nativeElement.value);
  this.cities = this.selectedState = this.selectedCity = null;
  var country = JSON.parse(this.country.nativeElement.value).name;
  // console.log(country);
  this.registerForm.controls['Country'].setValue(country);
}

onStateChange($event: any): void {
  this.cities = City.getCitiesOfState(JSON.parse(this.country.nativeElement.value).isoCode, JSON.parse(this.state.nativeElement.value).isoCode)
  this.selectedState = JSON.parse(this.state.nativeElement.value);
  this.selectedCity = null;
  var state = JSON.parse(this.state.nativeElement.value).name;
  // console.log(state);
  this.registerForm.controls['State'].setValue(state);
}

onCityChange($event: any): void {
  this.selectedCity = JSON.parse(this.city.nativeElement.value)
  var city = JSON.parse(this.city.nativeElement.value).name;
  // console.log(city);
  this.registerForm.controls['City'].setValue(city);
}

clear(type: string): void {
  switch (type) {
    case 'country':
      this.selectedCountry = this.country.nativeElement.value = this.states = this.cities = this.selectedState = this.selectedCity = null;
      break;
    case 'state':
      this.selectedState = this.state.nativeElement.value = this.cities = this.selectedCity = null;
      break;
    case 'city':
      this.selectedCity = this.city.nativeElement.value = null;
      break;
  }
}


  confirmpass: string = 'none';
  registerForm! : FormGroup
  profilePic!: string;
  url = "assets/Default_pfp.svg.png";
  showPassword: boolean = false;
  selectedFile!: File;
  imageUrl!: string;
  imagePreview!: string | ArrayBuffer | null;
  defaultImageUrl: string = "assets/Default_pfp.svg.png";


  constructor(private http: HttpClient,private fb: FormBuilder,private api: ApiService,private route: Router, private toastr: ToastrService, private auth: AuthService){}


 

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      fname: ["", [Validators.required, Validators.minLength(2), Validators.pattern("[a-zA-Z].*")]],
      lname: ["",[Validators.required, Validators.minLength(2), Validators.pattern("[a-zA-Z].*")]],
      email: ["",[Validators.required, Validators.email ]],
      password: ["",[Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      confirmPassword: ["",[Validators.required]],
      dob: ["",[Validators.required]],
      gender: ["",[Validators.required]],
      country1: ["",[Validators.required]],
      city1: ["",[Validators.required]],
      state1: ["",[Validators.required]],
      Country:[],
      City:[],
      State:[],
      address: ["",[Validators.required]],
      pfp: ["",[Validators.required]],
      phonenum: ["", [Validators.required ]],
      Role: ["user"],
      Token: [""],
      RegistrationDate:new FormControl(),

    })

    
  }

  get fname(): FormControl {
    return this.registerForm.get('fname') as FormControl;
  }

  get lname(): FormControl {
    return this.registerForm.get('lname') as FormControl;
  }

  get gender(): FormControl {
    return this.registerForm.get('gender') as FormControl;
  }

  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  get dob(): FormControl {
    return this.registerForm.get('dob') as FormControl;
  }

  get country1(): FormControl {
    return this.registerForm.get('country1') as FormControl;
  }

  get city1(): FormControl {
    return this.registerForm.get('city1') as FormControl;
  }

  get state1(): FormControl {
    return this.registerForm.get('state1') as FormControl;
  }

  get address(): FormControl {
    return this.registerForm.get('address') as FormControl;
  }

  get pfp(): FormControl {
    return this.registerForm.get('pfp') as FormControl;
  }

  get phonenum(): FormControl {
    return this.registerForm.get('phonenum') as FormControl;
  }



  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.showPreview();
  }


  
  showPreview() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.imagePreview = this.defaultImageUrl;
    }
  }
  
  public togglePassword() {
    this.showPassword = !this.showPassword;
  }
  
  onsubmit()  {
    if (this.registerForm.valid && this.password.value === this.confirmPassword.value) {
      const currentDate = new Date();
      this.registerForm.patchValue({ RegistrationDate: currentDate.toISOString() });
  
      const formData = new FormData();
      formData.append('pfp', this.selectedFile);
  
      this.api.uploadImage(this.selectedFile).subscribe(
        (response) => {
          const imagePath = `https://localhost:7219/Resources/Images/${response.fileName}`;
  
          const user = {
            ...this.registerForm.value,
            pfp: imagePath
          };
  
          this.auth.signUp(user).subscribe({
            next: (res) => {
              this.toastr.success(`Account created successfully!`, "Success", {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-left'
              });
              this.route.navigate(['']);
            },
            error: (err) => {
              const errorMessage = err?.error?.message || "Email Already Exists";
  
              this.toastr.error(errorMessage, "Failed", {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-left'
              });
            }
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      ValidateForm.validateAllFormfields(this.registerForm);
    }
  }



}
