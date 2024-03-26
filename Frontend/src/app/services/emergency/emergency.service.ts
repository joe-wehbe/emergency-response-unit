import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {

  private base_url:string = "http://localhost:8000/api/v0.1/emergency/";

  constructor(private http:HttpClient) { }

  reportEmergency(location:string, reporter_description:string){
    const body = {
      "location": location,
      "reporter_description": reporter_description
    }
    return this.http.post(this.base_url + "report-emergency", body);
  }
  
  getOngoingEmergencies(){
    return this.http.get(this.base_url + "get-ongoing-emergencies");
  }

  getEndedEmergencies(){
    return this.http.get(this.base_url + "get-ended-emergencies");
  }

  deleteEmergency(id:number){
    return this.http.delete(`${this.base_url}delete-emergency/${id}`);
  }

  getEmergency(id:number){
    return this.http.get(`${this.base_url}get-emergency/${id}`);
  }

  getEmergencyAssessments(id: number) {
    return this.http.get(`${this.base_url}get-emergency-assessments/${id}`);
  }  

  getNoResponseEmergencies(){
    return this.http.get(this.base_url + "get-no-response-emergencies");
  }
}
