import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  selectedOption: string = 'SSF';
  password: string = '';
  showPassword: boolean = false;
  email: string = '';
  emailPattern: string = '^[^\\s@]+@lau\\.edu(?:\\.lb)?$';
  rememberMe: boolean = false;
  
  constructor(
    private authService:AuthService,
    private router: Router, 
    private toastController: ToastController,
    private appComponent: AppComponent) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(){
    this.autoLogin();
  }

  autoLogin(){
    const rememberToken = localStorage.getItem("rememberToken");

    if(rememberToken){
      this.authService.autoLogin(rememberToken)
      .subscribe({
        next: (response) => {
          console.log('Auto login successful:', response);
          const user_type = localStorage.getItem("user_type");

          if(user_type == "1"){
            this.router.navigate(['./tabs/report-emergency']);
          }

          if(user_type == "2"){
            this.router.navigate(['./report']);
          }

        },
        error: (error) => {
          console.error('Error auto logging in:', error);
        },
      });
    }
  }

  login() {
    if (!this.email || !this.password) {
      this.presentToast('Email and password cannot be empty');
    } 
    else if (!this.email.match(this.emailPattern)) {
      this.presentToast('Invalid LAU email');
    } 
    else {
      this.authService.login(this.email, this.password, this.rememberMe).subscribe(response => {
        const parsedResponse = JSON.parse(JSON.stringify(response));
        console.log("Response: ", parsedResponse);
        console.log("Remember me: ", this.rememberMe);
  
        if (parsedResponse.status === 'Invalid credentials') {
          this.presentToast('Incorrect email or password');
        } 
        else if (parsedResponse.status === 'Login attempts exceeded') {
          this.presentToast('Login attempts limit reached. Try again in 24 hours.');
        } 
        else if (parsedResponse.status === 'Login successful') {
          localStorage.setItem('user_id', parsedResponse.user_id);
          localStorage.setItem('first_name', parsedResponse.first_name);
          localStorage.setItem('last_name', parsedResponse.last_name);
          localStorage.setItem('lau_email', parsedResponse.lau_email);
          localStorage.setItem('profile_picture', parsedResponse.profile_picture);
          localStorage.setItem('user_type', parsedResponse.user_type);
          localStorage.setItem('read_announcements_count', '0');
          localStorage.setItem('auth_token', parsedResponse.token);
  
          if (parsedResponse.user_type == 1) {
            localStorage.setItem('rank', parsedResponse.rank.rank_name);
            this.router.navigate(["/tabs/report-emergency"]);
            console.log(localStorage);
          } 
          else if (parsedResponse.user_type == 2) {
            this.router.navigate(["report"]);
            console.log(localStorage);
          }
          this.appComponent.ngOnInit();
        }
      });
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  navigateRegister(){
    this.router.navigate(["/register"]);
  }
}
