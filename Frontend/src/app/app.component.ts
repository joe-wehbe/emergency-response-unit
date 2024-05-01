import { Component, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/authentication/auth.service';
import { FcmService } from './services/firebase/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  user: any;

  showSideMenu = true;
  darkMode = false;
  reportPageActive = false;

  id: string = '';
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  rank: string = '';
  request_status: string = '';

  @Output() darkModeToggled = new EventEmitter<boolean>();

  constructor(private router: Router, private alertController: AlertController, private authService:AuthService,
    private toastController: ToastController, private userService: UserService, private fcmService: FcmService) {

    this.router.events.pipe(filter((event: RouterEvent): event is NavigationEnd =>event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      const currentUrl = event.url;
      this.reportPageActive = currentUrl === '/report' || currentUrl.startsWith('/report/');
      const routeData = this.router.routerState.snapshot.root.firstChild ?.data as { showSideMenu?: boolean };
      this.showSideMenu = routeData ? routeData['showSideMenu'] !== false : true && !this.reportPageActive;
    });
    this.forgetUser();
  }

  forgetUser(){
    if (!localStorage.getItem("rememberToken")) {
      this.authService.logout(localStorage.getItem("lau_email") ?? '');
      localStorage.clear();
    }
    else{
      console.log("User remembered");
    }
  }

  ngOnInit(): void {
    console.log(localStorage);
    this.getUserInfo();
    this.checkDarkModeStatus();
  }

  getUserInfo() {
    this.id = localStorage.getItem('user_id') ?? '';
    if(this.id){
      this.userService.getUserInfo(this.id)
      .subscribe({
        next: (response) => {
          console.log("Fetched user data:", response);
          this.user = response['User'];
          this.first_name = this.user.first_name;
          this.last_name = this.user.last_name;
          this.rank = this.user.rank? this.user.rank.rank_name : null;
          this.email = this.user.lau_email;
        },
        error: (error) => {
          console.error("Error getting user info:", error);
        },
        complete: () => {
          this.checkSignupRequestStatus();
        }
      });
    }
  }

  checkSignupRequestStatus() {
    if(this.email){
      console.log("Email: ", this.email);
      this.userService.getRequestStatus(this.email)
      .subscribe({
        next: (response) => {
          console.log('Fetched signup request status:', response);
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.request_status = parsedResponse.status;
        },
        error: (error) => {
          console.error('Error fetching signup request status:', error);
        },
      });
    }
  }

  async applyAlert() {
    const alert = await this.alertController.create({
      header: 'Applying to ERU',
      subHeader: 'Applications with incorrect information will not be considered!',
      cssClass: 'alert-dialog',
      mode: 'ios',

      inputs: [
        {
          name: 'id',
          type: 'number',
          placeholder: 'LAU ID...',
          cssClass: 'location-input',
          attributes: {
            required: true,
          },
        },
        {
          name: 'number',
          type: 'number',
          placeholder: 'Phone number...',
          cssClass: 'description-input',
          attributes: {
            required: true,
          },
        },
        {
          name: 'major',
          type: 'text',
          placeholder: 'Major...',
          cssClass: 'description-input',
          attributes: {
            required: true,
          },
        },
      ],

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            return true;
          },
        },
        {
          text: 'Apply',
          cssClass: 'alert-button-ok-green',
          handler: async (data) => {
            if (!data.id || !data.number || !data.major) {
              const message = 'All fields are required';
              const toast = await this.toastController.create({message: message, duration: 2000, position: 'bottom',});
              toast.present();
              return false;

            } else {
              this.userService.apply(data.id, data.number, data.major)
                .subscribe({
                  next: (response) => {
                    console.log('User applied successfully:', response);
                    this.fcmService.notifyForRegistrationRequest(this.first_name, this.last_name)
                  },
                  error: (error) => {
                    console.error('Error applying:', error);
                  },
                });
              return true;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  checkDarkModeStatus() {
    const checkIsDarkMode = localStorage.getItem('darkModeActivated');
    this.darkMode = checkIsDarkMode === 'true';
    document.body.classList.toggle('dark', this.darkMode);
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if (this.darkMode) {
      localStorage.setItem('darkModeActivated', 'true');
      this.darkModeToggled.emit(this.darkMode);
    } else {
      localStorage.setItem('darkModeActivated', 'false');
      this.darkModeToggled.emit(this.darkMode);
    }
  }

  async logoutAlert() {
    const alert = await this.alertController.create({
      header: 'Logging out',
      subHeader: 'Are you sure you want to logout? You can always log back in.',
      cssClass: 'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Logout',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            this.authService.logout(this.email)
            .subscribe({
              next: (response) => {
                console.log('Logged out successfully:', response);
                localStorage.clear();
                this.router.navigate(['./login']);
              },
              error: (error) => {
                console.error('Error logging out:', error);
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
