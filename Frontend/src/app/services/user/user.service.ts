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

  logout(){
    // TO IMPLEMENT WHEN WE HAVE LOGIN
  }
}
