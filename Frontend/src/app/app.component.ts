import { Component, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

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

  constructor(private router: Router, private alertController: AlertController,
    private toastController: ToastController,private userService: UserService) {
    this.router.events.pipe(filter((event: RouterEvent): event is NavigationEnd =>event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      const currentUrl = event.url;
      this.reportPageActive = currentUrl === '/report' || currentUrl.startsWith('/report/');
      const routeData = this.router.routerState.snapshot.root.firstChild ?.data as { showSideMenu?: boolean };
      this.showSideMenu = routeData ? routeData['showSideMenu'] !== false : true && !this.reportPageActive;
    });
  }

  ngOnInit(): void {
    this.checkDarkModeStatus();
    this.getUserInfo();
    this.checkSignupRequestStatus();
  }

  checkSignupRequestStatus() {
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

  getUserInfo() {
    this.first_name = localStorage.getItem('first_name') ?? ''; 
    this.last_name = localStorage.getItem('last_name') ?? ''; 
    this.rank = localStorage.getItem('rank') ?? ''; 
    this.email = localStorage.getItem('lau_email') ?? ''; 
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
            this.userService.logout(this.email)
            .subscribe({
              next: (response) => {
                console.log('Loggout out successfully:', response);
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
