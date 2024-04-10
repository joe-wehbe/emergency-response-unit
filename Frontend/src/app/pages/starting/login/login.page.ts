import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { UserService } from 'src/app/services/user/user.service';

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
    private userService:UserService, 
    private router: Router, 
    private toastController: ToastController,
    private appComponent: AppComponent) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!this.email || !this.password) {
      this.presentToast('Email and password cannot be empty');
    } 
    else if (!this.email.match(this.emailPattern)) {
      this.presentToast('Invalid email');
    } 
    else {
      this.userService.login(this.email, this.password).subscribe( (response) => {
        const parsedResponse = JSON.parse(JSON.stringify(response));
        console.log("Response: ", parsedResponse);

        if(parsedResponse.status === 'Invalid credentials') {
          this.presentToast('Incorrect email or password');
        } 

        if(parsedResponse.status === 'Login attempts exceeded') {
          this.presentToast('Login attempts limit reached. Try again in 24 hours.');
        }

        else if(parsedResponse.status === 'Login successful') {
          localStorage.setItem('user_id', parsedResponse.user_id);
          localStorage.setItem('first_name', parsedResponse.first_name);
          localStorage.setItem('last_name', parsedResponse.last_name);
          localStorage.setItem('lau_email',  parsedResponse.lau_email);
          localStorage.setItem('profile_picture', parsedResponse.profile_picture);
          localStorage.setItem('user_type', parsedResponse.user_type);
          localStorage.setItem('auth_token', parsedResponse.token);

          if(parsedResponse.user_type == 1){
            localStorage.setItem('rank',  parsedResponse.rank.rank_name);
            this.router.navigate(["/tabs/report-emergency"]);
            console.log(localStorage);
          }
          else if(parsedResponse.user_type == 2){
            this.router.navigate(["report"]);
            console.log(localStorage);
          }
          this.appComponent.getUserInfo();
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
