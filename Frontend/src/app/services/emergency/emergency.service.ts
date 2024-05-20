import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {

  private baseUrl:string = "http://localhost:8000/api/v0.1/emergency/";
  private userId: string = localStorage.getItem("user_id") ?? '';

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
    return this.http.post(this.baseUrl + "report-emergency", body, {headers: this.getAuthHeaders()});
  }

  checkMedicResponse(id: number){
    return this.http.get(this.baseUrl + "check-medic-response/" + id, {headers: this.getAuthHeaders()});
  }
  
  // STANDBY PAGE
  getOngoingEmergencies(){
    return this.http.get(this.baseUrl + "get-ongoing-emergencies", {headers: this.getAuthHeaders()});
  }

  getOngoingEmergenciesCount(){
    return this.http.get(this.baseUrl + "get-ongoing-emergencies-count", {headers: this.getAuthHeaders()});
  }

  getEndedEmergencies(){
    return this.http.get(this.baseUrl + "get-ended-emergencies", {headers: this.getAuthHeaders()});
  }

  deleteEmergency(id:number){
    return this.http.delete(`${this.baseUrl}delete-emergency/${id}`, {headers: this.getAuthHeaders()});
  }

  // EMERGENCY DETAILS PAGE
  findOngoingEmergencyByMedicId(medic_id:string){
    return this.http.get(this.baseUrl + "find-ongoing-emergency/" + this.userId, {headers: this.getAuthHeaders()});
  }

  getEmergency(id:number){
    return this.http.get(`${this.baseUrl}get-emergency/${id}`, {headers: this.getAuthHeaders()});
  }

  getEmergencyAssessments(id: number) {
    return this.http.get(`${this.baseUrl}get-emergency-assessments/${id}`, {headers: this.getAuthHeaders()});
  }  

  // ON SCENE PAGE
  getNoResponseEmergencies(){
    return this.http.get(this.baseUrl + "get-no-response-emergencies", {headers: this.getAuthHeaders()});
  }

  acceptEmergency(id:number){
    const body = {
      "id": id,
      "medic_id": localStorage.getItem('user_id')
    }
    return this.http.put(this.baseUrl + "accept-emergency", body, {headers: this.getAuthHeaders()});
  }

  // MEDIC EMERGENCY DETAILS PAGE
  getEmergencyWithLastAssessment(id:number){
    return this.http.get(`${this.baseUrl}get-emergency-with-last-assessment/${id}`, {headers: this.getAuthHeaders()});
  }

  addEmergencyDetails(id:number, patient_name:string, patient_lau_id:number, medic_description:string, patient_condition:string){
    const body = {
      'id': id,
      'patient_name': patient_name,
      'patient_lau_id': patient_lau_id,
      'medic_description': medic_description,
      'patient_condition': patient_condition
    }
    return this.http.put(this.baseUrl + "add-emergency-details", body, {headers: this.getAuthHeaders()});
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
    return this.http.post(this.baseUrl + "add-assessment", body, {headers: this.getAuthHeaders()});
  }

  endEmergency(id:number){
    const body = {
      "id": id,
    }
    return this.http.put(this.baseUrl + "end-emergency"  , body, {headers: this.getAuthHeaders()});
  }

  // CASE REPORTS PAGE
  getAllCaseReports(){
    return this.http.get(this.baseUrl + "get-all-case-reports",  { headers: this.getAuthHeaders() }); 
  }

  getCaseReportsCount(){
    return this.http.get(this.baseUrl + "get-case-reports-count",  { headers: this.getAuthHeaders() }); 
  }

  // EMERGENCY RECORDS PAGE
  getAllEmergenciesWithLastAssessment(){
    return this.http.get(`${this.baseUrl}get-all-emergencies-with-last-assessment`, {headers: this.getAuthHeaders()});
  }

  //ADMIN PANEL PAGE
  exportPDF() {
    return this.http.get(`${this.baseUrl}, {responseType: 'blob'}`);
  }
}
