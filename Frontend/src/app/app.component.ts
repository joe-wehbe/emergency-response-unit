import { Component, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  showSideMenu = true;
  darkMode = false;
  @Output() darkModeToggled = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.checkDarkModeStatus();
  }

  constructor(private router: Router, private alertController: AlertController) {
    this.router.events
      .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const routeData = this.router.routerState.snapshot.root.firstChild?.data as { showSideMenu?: boolean };
        this.showSideMenu = routeData ? routeData['showSideMenu'] !== false : true;
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
