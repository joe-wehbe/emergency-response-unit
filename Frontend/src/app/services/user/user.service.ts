import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private base_url: string = 'http://localhost:8000/api/v0.1/user/';
  private userId: string = localStorage.getItem("user_id") ?? '';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`,});
    return headers;
  }

  // REPORT PAGE
  apply(student_id: number, phone_number: string, major: string) {
    const body = {
      user_id: this.userId,
      student_id: student_id,
      phone_number: phone_number,
      major: major,
    };
    return this.http.put(this.base_url + 'apply', body);
  }

  getRequestStatus(email: string) {
    return this.http.get(this.base_url + 'get-request-status/' + email);
  }

  // PROFILE PAGE
  getUserInfo(id:string): Observable<any> {
    return this.http.get(this.base_url + 'get-user-info/' + id, {headers: this.getAuthHeaders()});
  }

  getUserShifts(id:string) {
    return this.http.get(this.base_url + 'get-user-shifts/' + id, {headers: this.getAuthHeaders()});
  }

  getSemester() {
    return this.http.get(this.base_url + 'get-semester', {headers: this.getAuthHeaders()});
  }

  requestCover($shift_id: number, $reason: string) {
    const body = {
      user_id: this.userId,
      shift_id: $shift_id,
      reason: $reason
    };
    return this.http.post(this.base_url + 'request-cover', body, {headers: this.getAuthHeaders()});
  }

  markAttendance() {
    const body = {user_id: this.userId};
    return this.http.put(this.base_url + 'mark-attendance', body, {headers: this.getAuthHeaders()});
  }

  // EDIT PROFILE PAGE
  editBio($bio: string) {
    const body = {
      id: this.userId,
      bio: $bio
    };
    return this.http.put(this.base_url + 'edit-bio', body, {headers: this.getAuthHeaders()});
  }

  editTags($tags: string) {
    const body = {
      id: this.userId,
      tags: $tags
    };
    return this.http.put(this.base_url + 'edit-tags', body, {headers: this.getAuthHeaders()});
  }

  // COMMUNITY PAGE
  getAllMembers() {
    return this.http.get(this.base_url + 'get-all-members/' + this.userId, {headers: this.getAuthHeaders()});
  }

  // ANNOUNCEMENTS PAGE
  getAllAnnouncements() {
    return this.http.get(this.base_url + 'get-all-announcements', {headers: this.getAuthHeaders()});
  }

  // COVER REQUESTS PAGE
  getAllCoverRequests() {
    return this.http.get(this.base_url + 'get-all-cover-requests/' + this.userId, {headers: this.getAuthHeaders()});
  }

  acceptCoverRequest($id: number) {
    const body = {
      id: $id,
      covered_by: this.userId,
    };
    return this.http.put(this.base_url + 'accept-cover-request', body,  { headers: this.getAuthHeaders() });
  }

  // CASE REPORTS PAGE
  addCaseReport(emergency_id: number, patient_name: string, location: string, patient_condition: string, history: string,
    treatment_administration: string, transportation: string, equipment: string, consultation: string, issues: string) {
    const body = {
      id: emergency_id,
      patient_name: patient_name,
      location: location,
      patient_condition: patient_condition,
      history: history,
      treatment_administration: treatment_administration,
      transportation: transportation,
      equipment: equipment,
      consultation: consultation,
      issues: issues,
    };
    return this.http.put(this.base_url + 'add-case-report', body);
  }

  // EXTENSIONS PAGE
  getExtensions() {
    return this.http.get(this.base_url + 'get-extensions');
  }

  // MEDICAL FAQs PAGE
  getMedicalFAQs(type: string) {
    return this.http.get(this.base_url + 'get-medical-faqs/' + type);
  }
}
