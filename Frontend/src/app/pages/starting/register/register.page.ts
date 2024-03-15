import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: string = '';
  password: string = '';
  fname: string = '';
  lname: string = '';
  major: string = '';
  id: string = '';
  confirmation: string = '';
  phone: string = '';

  selectedOption: string = 'SSF';
  showPassword: boolean = false;
  emailPattern: string = '^[^\\s@]+@lau\\.edu(?:\\.lb)?$';
  text: string = "Welcome to ERU, where help is just a click away!";
  emergencyResponseUnit: string = 'no';
  showContent: boolean = false;

  constructor(private router: Router, private toastController: ToastController) {}

  ngOnInit() {
  }
  
  next() {
    if (this.emergencyResponseUnit !== '') {
      this.showContent = true;
    } else {
      console.log('Please select whether you are in the emergency response unit or not.');
    }
    this.text = "Sign up with your LAU email";
  }

  back() {
    this.showContent = false;
    this.text = "Welcome to ERU, where help is just a click away!";
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async register() {
    if (this.emergencyResponseUnit == 'yes' && (!this.password || !this.email || !this.fname || !this.lname || !this.id || !this.major || !this.phone)) {
      this.presentToast('All fields are required.');
    
    }else if (this.emergencyResponseUnit == 'no' && (!this.password || !this.email || !this.fname || !this.lname)){
      this.presentToast('All fields are required.');

    } else if (!this.email.match(this.emailPattern)) {
      this.presentToast('Please enter a valid LAU email.');

    } else if (this.password !== this.confirmation) {
      this.presentToast('Incorrect password confirmation.');

    } else {
      if (this.emergencyResponseUnit == 'yes') {
        this.router.navigate(["./pending-request"]);
      } else {
        this.router.navigate(["./report"]);
      }
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

  navigateLogin(){
    this.router.navigate(["/login"]);
  }
}
