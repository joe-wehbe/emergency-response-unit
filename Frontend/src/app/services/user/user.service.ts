import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private base_url:string = "http://localhost:8000/api/v0.1/user/";

  constructor(private http:HttpClient) {}

  getUserInfo(): Observable<any> {
    return this.http.get(this.base_url + "1/get-user-info"); // GET USER ID FROM THE LOCAL STORAGE
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
    return this.http.get("http://localhost:8000/api/v0.1/admin/get-user-shifts/1"); // GET USER ID FROM THE LOCAL STORAGE
  }

  logout(){
    // TO IMPLEMENT WHEN WE HAVE LOGIN
  }

  getSemester(){
    return this.http.get(this.base_url + "get-semester");
  }

  markAttendance(){
    const body = {
      "user_id": 1, // GET USER ID FROM THE LOCAL STORAGE
    }
    return this.http.put(this.base_url + "mark-attendance", body);
  }

  editBio($bio: string){
    const body = {
      "id": 1, // GET USER ID FROM THE LOCAL STORAGE
      "bio": $bio
    }
    return this.http.put(this.base_url + "edit-bio", body); 
  }

  editTags($tags: string){
    const body = {
      "id": 1, // GET USER ID FROM THE LOCAL STORAGE
      "tags": $tags
    }
    return this.http.put(this.base_url + "edit-tags", body); 
  }}
