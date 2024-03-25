import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private base_url:string = "http://localhost:8000/api/v0.1/admin/";

  constructor(private http:HttpClient) {}

  get_eru_members(){
    const response = this.http.get(this.base_url + "get-members");
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

}
