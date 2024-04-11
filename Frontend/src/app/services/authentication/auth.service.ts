import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private base_url: string = 'http://localhost:8000/api/v0.1/auth/';

  constructor(private http: HttpClient) {}

  register(first_name: string, last_name: string, studentId: string, number: string, major: string, 
    lau_email: string, password: string, confirmation:string, isERU: string) {

    const body = {
      first_name: first_name,
      last_name: last_name,
      student_id: studentId,
      phone_number: number,
      major: major,
      lau_email: lau_email,
      password: password,
      confirmation: confirmation,
      isERU: isERU,
    };
    const response = this.http.post(this.base_url + 'register', body);
    return response;
  }

  login(email: string, password: string, rememberMe: boolean) {
    const body = {
      lau_email: email,
      password: password,
      remember_me: rememberMe
    };
    return this.http.post<any>(this.base_url + "login", body).pipe(
      tap(result => {
        if (result.token && rememberMe) {
          localStorage.setItem('rememberToken', result.remember_token);
        }
      })
    );
  }

  autoLogin(rememberToken: string): Observable<any> {
    const body = { rememberToken };
    return this.http.post<any>(this.base_url + 'auto-login', body);
  }

  logout(email: string): Observable<any> {
    const body = {
      lau_email: email,
    };
    return this.http.post(this.base_url + 'logout', body, {});
  }
}
