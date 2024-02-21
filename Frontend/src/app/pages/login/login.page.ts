import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  selectedOption: string = 'SSF';

  password: string = '';
  showPassword: boolean = false;
  iconToShow: string = 'eye';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.iconToShow = this.showPassword ? 'eye-off' : 'another-icon-name';
  }

  constructor(private router:Router) {}

  navigateEmergency(){
    this.router.navigate(["./tabs/report-emergency"])
  }

}
