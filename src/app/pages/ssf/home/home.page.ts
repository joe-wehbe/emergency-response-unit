import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  selectedOption: string = 'SSF'; // Set the default option here

  password: string = '';
  showPassword: boolean = false;
  iconToShow: string = 'eye'; // Initial icon name

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.iconToShow = this.showPassword ? 'eye-off' : 'another-icon-name'; // Replace 'another-icon-name' with your desired icon
  }

  constructor() {}

}
