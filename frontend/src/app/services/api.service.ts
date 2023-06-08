import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getUser(email: string) {
    throw new Error('Method not implemented.');
  }

   private baseURL: string ='https://localhost:7219/api/User/'

  constructor(private http: HttpClient) { }
  getUsers(page = 1, pageSize = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get<any>(this.baseURL, { params });
  }
  

  getUserByEmail(email: string):Observable<any>{
    return this.http.get<any>(`${this.baseURL}email/${email}`);
  }

  deleteItem(id: number) {
    return this.http.delete(`${this.baseURL}${id}`);
  }


  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', image);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.post<any>(`https://localhost:7219/api/User/users/upload`, formData, { headers });
  }

  getRegistrations(): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7219/api/User/registrations`);
  }


getUserImage(fileName: string): Observable<Blob> {
  return this.http.get(`${this.baseURL}/image/${fileName}`, { responseType: 'blob' });
}

  
   
   getOne(id: number){
     return this.http.get(`${this.baseURL}${id}`);
   }


   
   updateData(user: any): Observable<any> {
    const url = `${this.baseURL}${user.id}`;
    return this.http.put(url, user);
  }
  
  
}
