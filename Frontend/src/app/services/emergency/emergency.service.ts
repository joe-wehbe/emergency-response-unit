import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {

  private base_url:string = "http://localhost:8000/api/v0.1/emergency/";

  constructor(private http:HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return headers;
  }

  // REPORT EMERGENCY PAGE 
  reportEmergency(location:string, reporter_description:string){
    const body = {
      "location": location,
      "reporter_description": reporter_description
    }
    return this.http.post(this.base_url + "report-emergency", body, {headers: this.getAuthHeaders()});
  }

  getOngoingForMedic(medic_id:string){
    const body = {
      "medic_id": medic_id,
    }
    return this.http.post(this.base_url + "find-ongoing-emergency", body, {headers: this.getAuthHeaders()});
  }
  
  // STANDBY PAGE
  getOngoingEmergencies(){
    return this.http.get(this.base_url + "get-ongoing-emergencies", {headers: this.getAuthHeaders()});
  }

  getEndedEmergencies(){
    return this.http.get(this.base_url + "get-ended-emergencies", {headers: this.getAuthHeaders()});
  }

  deleteEmergency(id:number){
    return this.http.delete(`${this.base_url}delete-emergency/${id}`, {headers: this.getAuthHeaders()});
  }

  // EMERGENCY DETAILS PAGE
  getEmergency(id:number){
    return this.http.get(`${this.base_url}get-emergency/${id}`, {headers: this.getAuthHeaders()});
  }

  getEmergencyAssessments(id: number) {
    return this.http.get(`${this.base_url}get-emergency-assessments/${id}`, {headers: this.getAuthHeaders()});
  }  

  // ON SCENE PAGE
  getNoResponseEmergencies(){
    return this.http.get(this.base_url + "get-no-response-emergencies", {headers: this.getAuthHeaders()});
  }

  acceptEmergency(id:number){
    const body = {
      "id": id,
      "medic_id": localStorage.getItem('user_id')
    }
    return this.http.put(this.base_url + "accept-emergency", body, {headers: this.getAuthHeaders()});
  }

  // MEDIC EMERGENCY DETAILS PAGE
  getEmergencyWithLastAssessment(id:number){
    return this.http.get(`${this.base_url}get-emergency-with-last-assessment/${id}`, {headers: this.getAuthHeaders()});
  }

  addEmergencyDetails(id:number, patient_name:string, patient_lau_id:number, medic_description:string, patient_condition:string){
    const body = {
      'id': id,
      'patient_name': patient_name,
      'patient_lau_id': patient_lau_id,
      'medic_description': medic_description,
      'patient_condition': patient_condition
    }
    return this.http.put(this.base_url + "add-emergency-details", body, {headers: this.getAuthHeaders()});
  }

  addAssessment(
    id:number, heart_rate:number, blood_pressure:string, oxygen_saturation:number, temperature:number, 
    respiration_rate:number, capillary_refill_time:number, hemoglucotest:number,pupils_reaction:string){

    const body = {
      'emergency_id': id,
      'heart_rate' : heart_rate,
      'blood_pressure' : blood_pressure,
      'oxygen_saturation' : oxygen_saturation,
      'temperature' : temperature,
      'respiration_rate' : respiration_rate,
      'capillary_refill_time' : capillary_refill_time,
      'hemoglucotest' : hemoglucotest,
      'pupils_reaction' : pupils_reaction,
    }
    return this.http.post(this.base_url + "add-assessment", body, {headers: this.getAuthHeaders()});
  }

  endEmergency(id:number){
    const body = {
      "id": id,
    }
    return this.http.put(this.base_url + "end-emergency", body, {headers: this.getAuthHeaders()});
  }

  // CASE REPORTS PAGE
  getAllCaseReports(){
    return this.http.get(this.base_url + "get-all-case-reports",  { headers: this.getAuthHeaders() }); 
  }

  // EMERGENCY RECORDS PAGE
  getAllEmergenciesWithLastAssessment(){
    return this.http.get(`${this.base_url}get-all-emergencies-with-last-assessment`);
  }
}
