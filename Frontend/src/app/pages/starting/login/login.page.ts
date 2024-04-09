import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
  constructor(private userService:UserService, private router: Router, private toastController: ToastController) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!this.email || !this.password) {
      this.presentToast('Incorrect email or password');
    } else if (!this.email.match(this.emailPattern)) {
      this.presentToast('Invalid email');
    } else {
      this.userService.login(this.email, this.password).subscribe( (response) => {
         
        const parsedResponse = JSON.parse(JSON.stringify(response));
        const status = parsedResponse.status;
        console.log(parsedResponse);
        if(status === 'Invalid credentials') {
          this.presentToast('Wrong email or password');
        }    else if(status === 'Too many failed login attempts') {
          this.presentToast('Account locked for 24 hours, too many attempts');
        }    else if(status === 'Login successful ssf') {
          localStorage.setItem('auth_token', parsedResponse.token);
          localStorage.setItem('user_id', parsedResponse.user_id);
          localStorage.setItem('first_name', parsedResponse.first_name);
          localStorage.setItem('last_name', parsedResponse.last_name);
          localStorage.setItem('lau_email',  parsedResponse.lau_email);
          localStorage.setItem('profile_picture', parsedResponse.profile_picture);
          localStorage.setItem("request_status", "ssf");
          
          this.router.navigate(['/report']);
          
        }  else if(status === 'Login successful member') {
          
          localStorage.setItem('auth_token', parsedResponse.token);
          localStorage.setItem('user_id', parsedResponse.user_id);
          localStorage.setItem('first_name', parsedResponse.first_name);
          localStorage.setItem('last_name', parsedResponse.last_name);
          localStorage.setItem('profile_picture', parsedResponse.profile_picture);
          localStorage.setItem('lau_email',  parsedResponse.lau_email);
          localStorage.setItem('request_status', parsedResponse.request);
          if(parsedResponse.request == "1"){
            this.router.navigate(['/tabs/report-emergency']);
            console.log(localStorage); 
          }else if(parsedResponse.request == "0" ||parsedResponse.request == "2"  ){
          this.router.navigate(['/report']);
          }
          
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
