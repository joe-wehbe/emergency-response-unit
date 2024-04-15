import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private base_url: string = 'http://localhost:8000/api/v0.1/admin/';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return headers;
  }

  // ADMIN PANEL
  updateSemesterDates($startDate:String, $endDate:String){
    const body = {
      "id": 1,
      "start_date": $startDate,
      "end_date": $endDate,
    }
    return this.http.put(this.base_url + "update-semester-dates", body, { headers: this.getAuthHeaders() }); 
  }

  // MANAGE MEMBERS TAB
  removeMember(id: string){
    const body = {id: id};
    return this.http.put(this.base_url + 'remove-member', body, { headers: this.getAuthHeaders() });
  }

  changeRank(user_id: string, rank_id: number) {
    const body = {user_id: user_id, rank_id: rank_id};
    return this.http.put(this.base_url + 'change-rank', body, { headers: this.getAuthHeaders() });
  }

  // CHANGE SCHEDULE PAGE
  getShiftCoversCount(userId:string, shiftId: number){
    return this.http.get(this.base_url + "get-shift-covers-count/" + userId + '/' + shiftId, { headers: this.getAuthHeaders() });
  }

  addShift(userId:number, shiftId:number){
    const body = {
      "user_id": userId,
      "shift_id": shiftId
    };
    return this.http.put(this.base_url + 'add-shift', body, { headers: this.getAuthHeaders() });
  }

  deleteShift(userId:string, shiftId:number){
    return this.http.delete(this.base_url + "delete-shift/" + userId + '/' + shiftId, { headers: this.getAuthHeaders() }); 
  }

  // MANAGE ANNOUNCEMENTS TAB
  addAnnouncement(id:string, importance:string, description:string, visible_to:number){
    const body = {
      "admin_id": id,
      "importance": importance,
      "description": description,
      "visible_to": visible_to
    }
    return this.http.post(this.base_url + "add-announcement", body, { headers: this.getAuthHeaders() }); 
  }

  deleteAnnouncement(id:number){
    return this.http.delete(this.base_url + "delete-announcement/" + id, { headers: this.getAuthHeaders() }); 
  }

  // MANAGE FAQs TAB
  addFaq(type: string, question: string, answer: string){
    const body = {
      "type": type,
      "question": question,
      "answer": answer
    }
    return this.http.post(this.base_url + "add-faq", body, { headers: this.getAuthHeaders() }); 
  }

  deleteFaq(id:number){
    return this.http.delete(this.base_url + 'delete-faq/' + id, { headers: this.getAuthHeaders() });
  }

  // MANAGE EXTENSIONS TAB
  addExtension(name: string, ext: string) {
    const body = {name: name, number: ext};
    return this.http.post(this.base_url + 'add-extension', body, { headers: this.getAuthHeaders() });
  }

  deleteExtension(id:number){
    return this.http.delete(this.base_url + 'delete-extension/' + id, { headers: this.getAuthHeaders() });
  }

  // ATTENDANCE RECORDS TAB
  getAttendanceRecords(){
    return this.http.get(this.base_url + "get-attendance-records", { headers: this.getAuthHeaders() });
  }

  // SIGNUP REQUESTS TAB
  getSignupRequests(){
    return this.http.get(this.base_url + "get-signup-requests", { headers: this.getAuthHeaders() });
  }

  acceptSignupRequest(request_id:number){
    const body = {
      "request_id": request_id
    }
    return this.http.put(this.base_url + "accept-signup-request/" + request_id, body, { headers: this.getAuthHeaders() }); 
    return this.http.put(this.base_url + "accept-signup-request/" + request_id, body, { headers: this.getAuthHeaders() }); 
  }

  rejectSignupRequest(request_id:number){
    const body = {
      "request_id": request_id
    }
    return this.http.put(this.base_url + "reject-signup-request/" + request_id, body, { headers: this.getAuthHeaders() }); 
    return this.http.put(this.base_url + "reject-signup-request/" + request_id, body, { headers: this.getAuthHeaders() }); 
  }
}
