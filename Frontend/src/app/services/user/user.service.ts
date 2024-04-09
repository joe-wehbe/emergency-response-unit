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
    return this.http.get(this.base_url + "get-user-shifts/1"); // GET USER ID FROM THE LOCAL STORAGE
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
  }

  requestCover($shift_id:number, $reason:string){
    const body = {
      "user_id": 1, // GET USER ID FROM THE LOCAL STORAGE
      "shift_id": $shift_id,
      "reason": $reason
    }
    return this.http.post(this.base_url + "request-cover", body);
  }

  getAllUsers(){
    return this.http.get(this.base_url + "get-all-users"); 
  }

  getAllAnnouncements(){
    return this.http.get(this.base_url + "get-all-announcements"); 
  }

  getAllCoverRequests(){
    return this.http.get(this.base_url + "get-all-cover-requests")
  }

  getExtensions(){
    return this.http.get(this.base_url + "get-extensions")
  }

  getMedicalFAQs(type: string){
    const response = this.http.get(this.base_url + "get-medical-faqs/" + type );
    return response;
  }

  acceptCoverRequests($id:number){ 
    const body = {
      "id": $id,
      "covered_by": 1, // GET USER ID FROM THE LOCAL STORAGE
    }
    return this.http.put(this.base_url + "accept-cover-request", body);
  }

  addCaseReport(emergency_id: number, patient_name: string, location: string, patient_condition: string, history: string, 
    treatment_administration: string, transportation: string, equipment: string, consultation: string, issues: string){
    const body = {
      "id": emergency_id,
      "patient_name": patient_name,
      "location": location,
      "patient_condition": patient_condition,
      "history": history,
      "treatment_administration": treatment_administration,
      "transportation": transportation,
      "equipment": equipment,
      "consultation": consultation,
      "issues": issues,
    }
    return this.http.put(this.base_url + "add-case-report", body);
  }
 
}

  




