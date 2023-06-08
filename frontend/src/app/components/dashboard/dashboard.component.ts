import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterViewInit  {

  
  public fullName : string = "";
  public role: string = "";

  // user : any = [];
  // public users:any =[];
  // User:any =[]
  User: any;
  
  pageSize = 3; // Number of users per page
  currentPage = 1;
  totalPages!: number;
  pages!: number[]
  users: any[] = [];
  pagedUsers!: any[];
  loginForm: any;
  adminId!: number;
  jumpToPage: number | undefined;
  fname: any;
  columns: string[] = ['fname', 'lname', 'email'];
  registrations: any[] = [];
  Admins: any;



  constructor (private auth: AuthService,private route: Router, private http: HttpClient, private api: ApiService, private userStore: UserStoreService,private toastr: ToastrService) {}


  
  ngOnInit(){

    this.loadRegistrations();
   
    this.api.getUsers().subscribe(res => {
      this.User = res.filter((user: { role: string; }) => user.role !== 'Admin');
      this.Admins = res.filter((user: { role: string; }) => user.role === 'Admin');
                  for(let admin of this.Admins){
                    const Fullname = `${admin.fname} ${admin.lname}`
                    if(admin.role === "Admin" && Fullname === this.fullName){
                      this.adminId = admin.id;
                    }
                  }
      this.totalPages = Math.ceil(this.User.length / this.pageSize);
      this.setPage(1);
    });
    
    
    this.userStore.getFullNameFromStore()
    .subscribe(val=>{
      let FullNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = val || FullNameFromToken;
    })

    this.userStore.getRoleFromStore()
    .subscribe(val=>{
      let roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken
    })

    
  }


  ngAfterViewInit() {
    // Move the chart initialization code here
    this.initializeChart();
  }



  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.pagedUsers = this.User.slice((page - 1) * this.pageSize, page * this.pageSize);
    this.calculatePages();
  }
  

  calculatePages(): void {
    const visiblePages = 5; // Number of visible page numbers in the pagination
    const halfVisiblePages = Math.floor(visiblePages / 2);
    let startPage: number;
    let endPage: number;
  
    if (this.totalPages <= visiblePages) {
      // Less than or equal to visiblePages, display all pages
      startPage = 1;
      endPage = this.totalPages;
    } else if (this.currentPage - halfVisiblePages <= 0) {
      // First visiblePages pages
      startPage = 1;
      endPage = visiblePages;
    } else if (this.currentPage + halfVisiblePages >= this.totalPages) {
      // Last visiblePages pages
      startPage = this.totalPages - visiblePages + 1;
      endPage = this.totalPages;
    } else {
      // Middle visiblePages pages
      startPage = this.currentPage - halfVisiblePages;
      endPage = this.currentPage + halfVisiblePages;
    }
  
    this.pages = Array(endPage - startPage + 1).fill(null).map((_, i) => startPage + i);
  }
  

  prevPage(): void {
    this.setPage(this.currentPage - 1);
  }
  

  nextPage(): void {
    this.setPage(this.currentPage + 1);
  }

  goToLastPage(): void {
    this.setPage(this.totalPages);
  }

  jumpTo(pageNumber: string): void {
    const page = parseInt(pageNumber, 10);
    if (page && page >= 1 && page <= this.totalPages) {
      this.setPage(page);
    }
  }
 
  search(searchTerm: string): void {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (!searchTerm) {
      this.resetSearch();
      return;
    }
    const filteredUsers = this.User.filter((user: any) =>
      Object.values(user).some((value: any) =>
        typeof value === 'string' && value.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
    this.totalPages = Math.ceil(filteredUsers.length / this.pageSize);
    this.currentPage = 1;
    this.pagedUsers = filteredUsers.slice(0, this.pageSize);
  }
  
  resetSearch(): void {

  
    // Reset other properties
    this.totalPages = Math.ceil(this.User.length / this.pageSize);
    this.currentPage = 1;
    this.pagedUsers = this.User.slice(0, this.pageSize);
  }


  clearSearchInput(): void {
    const searchInput = document.getElementById('form1') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
    // Reset other properties
    this.totalPages = Math.ceil(this.User.length / this.pageSize);
    this.currentPage = 1;
    this.pagedUsers = this.User.slice(0, this.pageSize);
  }
  
  
  

  sortTable(column: string): void {
    if (column === 'fname') {
      this.User.sort((a: { [x: string]: string }, b: { [x: string]: string }) => {
        const valA = a[column].toLowerCase();
        const valB = b[column].toLowerCase();
        return valA.localeCompare(valB);
      });
    } else if (column === 'lname') {
      this.User.sort((a: { [x: string]: string }, b: { [x: string]: string }) => {
        const valA = a[column].toLowerCase();
        const valB = b[column].toLowerCase();
        return valA.localeCompare(valB);
      });
    } else if (column === 'email') {
      this.User.sort((a: { [x: string]: string }, b: { [x: string]: string }) => {
        const valA = a[column].toLowerCase();
        const valB = b[column].toLowerCase();
        return valA.localeCompare(valB);
      });
    }
  
    this.setPage(this.currentPage);
  
    // Update the URL without triggering a page refresh
    history.replaceState({}, '', `?sort=${column}`);
  }
  
  signout(){
    this.auth.signOut();
  }

  deleteItem(id: number) {
    this.api.deleteItem(id).subscribe(() => {
      this.pagedUsers = this.pagedUsers.filter(user => user.id !== id);
      this.toastr.success('Record Deleted', 'Success',{ 
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        
        });
    });
  }


  
  loadRegistrations() {
    this.api.getRegistrations().subscribe(
      (response) => {
        this.registrations = response;
        console.log(this.registrations);

        this.updateChart();
      },
      (error) => {
        console.error('Error occurred while retrieving registrations:', error);
        // Handle the error
        // ...
      }
    );
  }

  initializeChart() {
    const ctxL: HTMLCanvasElement = document.getElementById("lineChart") as HTMLCanvasElement;
    const labels = [];
    const today = new Date();
  
    // Generate labels for the past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const label = `${day}-${month}-${year}`;
      labels.push(label);
    }

    const myLineChart = new Chart(ctxL, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Active users",
            data: [],
            backgroundColor: 'rgba(105, 0, 132, .2)',
            borderColor: 'rgba(200, 99, 132, .7)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true
      }
    });
  }
 
  updateChart() {
    const ctxL: HTMLCanvasElement = document.getElementById("lineChart") as HTMLCanvasElement;
    const labels = [];
    const activeUsersData = [];
  
    // Destroy the existing chart if it exists
    const existingChart = Chart.getChart(ctxL);
    if (existingChart) {
      existingChart.destroy();
    }
  
    const today = new Date();
  
    // Generate labels for the past 7 days, starting from today
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const label = `${day}-${month}-${year}`;
      labels.push(label);
  
      // Find the registration for the current date
      const registration = this.registrations.find(registration => {
        const registrationDate = new Date(registration.date);
        return (
          registrationDate.getDate() === date.getDate() &&
          registrationDate.getMonth() === date.getMonth() &&
          registrationDate.getFullYear() === date.getFullYear()
        );
      });
  
      if (registration) {
        activeUsersData.push(registration.registeredUsers);
      } else {
        activeUsersData.push(0); // No registration found for the current date
      }
    }
  
    const myLineChart = new Chart(ctxL, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Registered users",
            data: activeUsersData,
            backgroundColor: 'rgba(105, 0, 132, .2)',
            borderColor: 'rgba(200, 99, 132, .7)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true
      }
    });
  }
  


}
  



