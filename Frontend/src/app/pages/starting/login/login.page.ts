import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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

  constructor(private router: Router, private toastController: ToastController) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    if (!this.email || !this.password) {
      this.presentToast('Incorrect email or password');
    } else if (!this.email.match(this.emailPattern)) {
      this.presentToast('Invalid email');
    } else {
      this.router.navigate(["./tabs/report-emergency"]);
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
