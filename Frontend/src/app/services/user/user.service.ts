import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, last } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private base_url:string = "http://localhost:8000/api/v0.1/user/";

  constructor(private http:HttpClient) {}
  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return headers;
  }
  getUserInfo(id:string): Observable<any> {
    return this.http.get(this.base_url + id +"/get-user-info", { headers: this.getAuthHeaders() }); 
  }

  getRequestStatus(email: string){
    return this.http.get(this.base_url + "get-request-status/" + email, { headers: this.getAuthHeaders() });
  }

  register_user(first_name:string, last_name:string, lau_email:string, password: string, user_type:number, /*remember_me:number*/){
    
      const headers: HttpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
      const options= { 
        headers: headers
      }
  
      const body = {
  "first_name": first_name,
  "last_name": last_name,
  "lau_email": lau_email,
  "password": password,
  "user_type": user_type,
  //"remember_me": remember_me
      }
  
       const response = this.http.post(this.base_url + "register", body, options);
       
        return response;
    
  }

  login(email:string, password:string){
    
    const headers: HttpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
    const options= { 
      headers: headers
    }

    const body = {
"lau_email": email,
"password": password,

//"remember_me": remember_me
    }

     const response = this.http.post(this.base_url + "login", body, options);
     
      return response;
  
}

  register_member(first_name:string, last_name:string, lau_email:string, password: string, user_type:number, id:string, number:string, major:string /*remember_me:number*/){
    
    const headers: HttpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
    const options= { 
      headers: headers
    }

    const body = {
"first_name": first_name,
"last_name": last_name,
"lau_email": lau_email,
"password": password,
"user_type": user_type,
"student_id": id,
"phone_number": number,
"major": major
//"remember_me": remember_me
    }

     const response = this.http.post(this.base_url + "register", body, options);
     
      return response;
  
}

  apply(student_id:number, phone_number:string, major:string){
    const body = {
      "user_id": 1, // GET USER ID FROM THE LOCAL STORAGE
      "student_id": student_id,
      "phone_number": phone_number,
      "major": major,
    }
    return this.http.put(this.base_url + "apply", body);
  }

  getUserShifts(){
    return this.http.get(this.base_url + "get-user-shifts/1", { headers: this.getAuthHeaders() }); // GET USER ID FROM THE LOCAL STORAGE
  }

  logout() {
    const response = this.http.post(this.base_url + 'logout', {  });
  return response;
  }
  getSemester(){
    return this.http.get(this.base_url + "get-semester", { headers: this.getAuthHeaders() });
  }

  markAttendance(){
    const body = {
      "user_id": 1, // GET USER ID FROM THE LOCAL STORAGE
    }
    return this.http.put(this.base_url + "mark-attendance", body, { headers: this.getAuthHeaders() });
  }

  editBio($bio: string){
    const body = {
      "id": 1, // GET USER ID FROM THE LOCAL STORAGE
      "bio": $bio
    }
    return this.http.put(this.base_url + "edit-bio", body, { headers: this.getAuthHeaders() }); 
  }

  editTags($tags: string){
    const body = {
      "id": 1, // GET USER ID FROM THE LOCAL STORAGE
      "tags": $tags
    }
    return this.http.put(this.base_url + "edit-tags", body, { headers: this.getAuthHeaders() }); 
  }

  requestCover($shift_id:number, $reason:string){
    const body = {
      "user_id": 1, // GET USER ID FROM THE LOCAL STORAGE
      "shift_id": $shift_id,
      "reason": $reason
    }
    return this.http.post(this.base_url + "request-cover", body, { headers: this.getAuthHeaders() });
  }

  getAllUsers(){
    return this.http.get(this.base_url + "get-all-users", { headers: this.getAuthHeaders() }); 
  }

  getAllAnnouncements(){
    return this.http.get(this.base_url + "get-all-announcements", { headers: this.getAuthHeaders() }); 
  }

  getAllCoverRequests(){
    return this.http.get(this.base_url + "get-all-cover-requests", { headers: this.getAuthHeaders() })
  }
}

  




