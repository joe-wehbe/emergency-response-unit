import { Component, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/authentication/auth.service';
import { EmergencyService } from './services/emergency/emergency.service';
import { AdminService } from './services/admin/admin.service';

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
  user_profile_pic: string = '';
  cover_requests_count: number = 0;
  case_reports_count: number = 0;
  ongoing_emergencies_count: number = 0;
  unread_announcements_count: number = 0;
  applicationsAllowed: boolean = false;
  permissionData: any[] = [];

  @Output() darkModeToggled = new EventEmitter<boolean>();

  constructor(private router: Router, private alertController: AlertController, private authService:AuthService,
    private toastController: ToastController, private userService: UserService, private emergencyService:EmergencyService,
    private adminService:AdminService) {
    this.router.events.pipe(filter((event: RouterEvent): event is NavigationEnd =>event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      const currentUrl = event.url;
      this.reportPageActive = currentUrl === '/report' || currentUrl.startsWith('/report/');
      const routeData = this.router.routerState.snapshot.root.firstChild ?.data as { showSideMenu?: boolean };
      this.showSideMenu = routeData ? routeData['showSideMenu'] !== false : true && !this.reportPageActive;
    });
  }

  ngOnInit(): void {
    this.getUserInfo();
    this.checkDarkModeStatus();
    if(localStorage.getItem("user_type") == '1'){
      this.getOngoingEmergenciesCount();
      this.getAnnouncementsCount();
      this.getCoverRequestsCount();
      this.getCaseReportsCount();
    }
    console.log(localStorage);
  }

  getUserInfo() {
    this.id = localStorage.getItem('user_id') ?? '';
    if(this.id){
      this.userService.getUserInfo(this.id)
      .subscribe({
        next: (response) => {
          this.user = response['User'];
          this.first_name = this.user.first_name;
          this.last_name = this.user.last_name;
          this.rank = this.user.rank? this.user.rank.rank_name : null;
          this.email = this.user.lau_email;
          this.user_profile_pic = this.user.profile_picture;
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
      this.userService.getRequestStatus(this.email)
      .subscribe({
        next: (response) => {
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.request_status = parsedResponse.status;
        },
        error: (error) => {
          console.error('Error fetching signup request status:', error);
        },
      });
    }
  }

  getOngoingEmergenciesCount(){
    this.emergencyService.getOngoingEmergenciesCount()
    .subscribe({
      next: (response: any) => {
        this.ongoing_emergencies_count = response.ongoingEmergenciesCount;
      },
      error: (error) => {
        console.error('Error fetching ongoing emergencies count:', error);
      },
    });
  }

  getAnnouncementsCount() {
    this.userService.getAnnouncementsCount()
    .subscribe({
      next: (response: any) => {
        if(response.announcementsCount < parseInt(localStorage.getItem("read_announcements_count")?? '0')){
          localStorage.setItem("read_announcements_count", (response.announcementsCount).toString());
        }   
        this.unread_announcements_count = response.announcementsCount - parseInt(localStorage.getItem("read_announcements_count")?? '0');
      }, 
      error: (error) => {
        console.error('Error fetching announcements count:', error);
      },
    });
  }

  getCoverRequestsCount(){
    this.userService.getCoverRequestsCount()
    .subscribe({
      next: (response: any) => {
        this.cover_requests_count = response.coverRequestsCount;
      },
      error: (error) => {
        console.error('Error fetching cover requests count', error);
      },
    });
  }

  getCaseReportsCount(){
    this.emergencyService.getCaseReportsCount()
    .subscribe({
      next: (response: any) => {
        this.case_reports_count = response.caseReportsCount;
      },
      error: (error) => {
        console.error('Error fetching case reports count:', error);
      },
    });
  }

  applyAlert() {
    this.userService.getApplicationsPermission()
    .subscribe({
      next: (response) => {
        console.log("Fetched applications permission", response);
        this.permissionData = (response as any)['Permission'];
        this.permissionData[0].status == 1 ? this.applicationsAllowed = true : this.applicationsAllowed = false;
      },
      error: (error) => {
        console.error("Error fetching applications permission:", error);
      },
      complete: async () => {
        if(this.applicationsAllowed){
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
                    this.presentToast("All fields are required");
                    return false;
      
                  } else {
                    this.userService.apply(data.id, data.number, data.major)
                      .subscribe({
                        next: () => {
                          this.presentToast("Application sent");
                          this.request_status = "pending";
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
        else{
          this.presentToast("Applications are currently closed")
        }
      }
    });
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
