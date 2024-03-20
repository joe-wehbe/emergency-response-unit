import { Component, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  showSideMenu = true;
  darkMode = false;
  reportPageActive = false;
  @Output() darkModeToggled = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.checkDarkModeStatus();
  }

  constructor(private router: Router, private alertController: AlertController, private toastController:ToastController) {
    this.router.events
    .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      const currentUrl = event.url;
      this.reportPageActive = currentUrl === '/report' || currentUrl.startsWith('/report/'); // Check if current URL is exactly "/report" or starts with "/report/"
      const routeData = this.router.routerState.snapshot.root.firstChild?.data as { showSideMenu?: boolean };
      this.showSideMenu = routeData ? routeData['showSideMenu'] !== false : true && !this.reportPageActive;
    });  
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
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Logout',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            this.router.navigate(["./login"])
          },
        },
      ],
    });
    await alert.present();
  }

  async applyAlert() {
    const alert = await this.alertController.create({
      header: 'Applying to ERU',
      subHeader: 'Applications with incorrect information will not be considered!',
      cssClass: "alert-dialog",
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
          handler: async(data) => {
            if(!data.id || !data.number || !data.major){
              const message = 'All fields are required';
              const toast = await this.toastController.create({
                message: message,
                duration: 2000, 
                position: 'bottom'
              });
              toast.present();
              return false;
            }
            else{
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
}
