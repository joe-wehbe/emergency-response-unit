import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
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

  constructor(private userService:UserService, private router: Router, private toastController: ToastController) {}

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

  async register(fname: string, lname:string, email:string, password:string, id:string, phone:string, major:string) {
   
    if (this.emergencyResponseUnit == 'yes' && (!this.password || !this.email || !this.fname || !this.lname || !this.id || !this.major || !this.phone)) {
      this.presentToast('All fields are required.');
    
    }else if (this.emergencyResponseUnit == 'no' && (!this.password || !this.email || !this.fname || !this.lname)){
      this.presentToast('All fields are required.');

    } else if (this.emergencyResponseUnit == 'no' && (this.password && this.email && this.fname && this.lname)){
      
      this.userService.register_user(fname, lname, email, password, 2).subscribe((response) => {
       
        const parsedResponse = JSON.parse(JSON.stringify(response));
        const status = parsedResponse.status;
        if(status === 'Email already has an account') {
          this.toastController.create({
            header: 'Error',
            message: status,
            buttons: ['OK']
          }).then((alert) => alert.present())
          .catch((err) => console.log(err));
        }else if(status === "Invalid password"){
        const message = parsedResponse.errors.join('\n');

          this.toastController.create({
            header: 'Error',
            message: message,
            buttons: ['OK']
          }).then((alert) => alert.present())
          .catch((err) => console.log(err));
        }else if (status === "Member registered successfully"){
          
          localStorage.setItem('auth_token', parsedResponse.token);
          this.router.navigate(['/login']);

        }      
      });

    } else if (this.emergencyResponseUnit == 'yes' && (this.password && this.email && this.fname && this.lname && this.id && this.major && this.phone)){
      
      this.userService.register_member(fname, lname, email, password, 1, id, phone, major).subscribe((response) => {
       
        const parsedResponse = JSON.parse(JSON.stringify(response));
        const status = parsedResponse.status;
        if(status === 'Login request sent to admin') {
          this.router.navigate(['/login']);
        }else if(status === "Invalid password"){
        const message = parsedResponse.errors.join('\n');

          this.toastController.create({
            header: 'Error',
            message: message,
            buttons: ['OK']
          }).then((alert) => alert.present())
          .catch((err) => console.log(err));
        }else if (status === "Member registered successfully"){
          
          localStorage.setItem('auth_token', parsedResponse.token);
          this.router.navigate(['/login']);

        }      
      });

    } else if (!this.email.match(this.emailPattern)) {
      this.presentToast('Please enter a valid LAU email.');

    } else if (this.password !== this.confirmation) {
      this.presentToast('Incorrect password confirmation.');

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
