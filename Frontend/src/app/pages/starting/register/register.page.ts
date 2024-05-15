import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  fname: string = '';
  lname: string = '';
  studentId: string = '';
  phone: string = '';
  major: string = '';
  email: string = '';
  password: string = '';
  confirmation: string = '';
  isERU: string = 'no';

  showPassword: boolean = false;
  showContent: boolean = false;

  emailPattern: string = '^[^\\s@]+@lau\\.edu(?:\\.lb)?$';
  text: string = "Welcome to ERU, where help is just a click away!";

  constructor(
    private authService:AuthService,
    private router: Router, 
    private toastController: ToastController,
    private appComponent: AppComponent
  ) {}

  ngOnInit() {
  }

  register() {
    if ((!this.password || !this.email || !this.fname || !this.lname) || 
    (this.isERU == 'yes' && (!this.studentId || !this.major || !this.phone))) {
      this.presentToast('All fields are required.');
    }
    else if(!this.email.match(this.emailPattern)){
      this.presentToast("Invalid LAU email");
    }
    else{
      console.log("Student id: ", this.studentId);
      this.authService.register(this.fname, this.lname, this.studentId, this.phone, this.major, this.email, this.password, this.confirmation, this.isERU)
      .subscribe((response) => {
        const parsedResponse = JSON.parse(JSON.stringify(response));
        const status = parsedResponse.status;

        if(status === "Account exists"){
          this.presentToast("This email is already registered");
        }
  
        else if(status === "Invalid password"){
          const message = parsedResponse.errors.join('\n');
          this.presentToast(message);
        }

        else if(status === "Password not confirmed"){
          this.presentToast("Incorrect password confirmation");
        }
  
        else if (status === "Success"){
          console.log(parsedResponse.token);
          localStorage.setItem('user_id', parsedResponse.id);
          localStorage.setItem('first_name', this.fname);
          localStorage.setItem('student_id', this.studentId)
          localStorage.setItem('phone_number', this.phone);
          localStorage.setItem('last_name', this.lname);
          localStorage.setItem('lau_email', this.email);
          localStorage.setItem('profile_picture', "undefined");
          localStorage.setItem('user_type', "2");
          localStorage.setItem('auth_token', parsedResponse.token);
          this.router.navigate(['/report']);
          this.appComponent.ngOnInit();
        }      
      }); 
    }
  }

  next() {
    if (this.isERU !== '') {
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
