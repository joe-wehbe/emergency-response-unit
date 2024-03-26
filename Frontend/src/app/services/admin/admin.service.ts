import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private base_url:string = "http://localhost:8000/api/v0.1/admin/";
  private base_url_user:string = "http://localhost:8000/api/v0.1/user/";
  constructor(private http:HttpClient) {}

  get_eru_members(){
    const response = this.http.get(this.base_url + "get-members");
    return response;
  }

  get_announcements(){
    const response = this.http.get(this.base_url_user + "get-all-announcements");
    return response;
  }

  get_ongoing_shifts(){
    const response = this.http.get(this.base_url + "get-ongoing-shifts");
    return response;
  }

  get_extensions(){
    const response = this.http.get(this.base_url_user + "get-extensions");
    return response;
  }

  get_user_info(id: number){
    const response = this.http.get(this.base_url_user + id + "/get-user-info");
    return response;
  }

  get_admins(){
    const response = this.http.get(this.base_url + "get-admins");
    return response;
  }

  add_member(lau_email: string){
    const headers: HttpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
    const options= { 
      headers: headers
    }

    const body = {
"lau_email": lau_email,
    }

     const response = this.http.put(this.base_url + "add-member", body, options);
     
      return response;

  }

  add_extension(name: string, ext: string){
    const headers: HttpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
    const options= { 
      headers: headers
    }

    const body = {
"name": name,
"number": ext
    }

     const response = this.http.post(this.base_url + "add-extension", body, options);
     
      return response;

  }

}
