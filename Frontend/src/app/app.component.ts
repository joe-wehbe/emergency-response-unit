import { Component, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  showSideMenu = true;
  darkMode = false;
  reportPageActive = false;
  user: any;
  first_name: string = "";
  last_name: string = "";
  email: string = "";
  id: string = "";
  rejected: boolean = false;
  user_rank: string = "";
  profile_picture: string = "";
  @Output() darkModeToggled = new EventEmitter<boolean>();
  request_status:string = "";
  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController:ToastController,
    private userService:UserService,
    ){
    this.router.events
    .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      const currentUrl = event.url;
      this.reportPageActive = currentUrl === '/report' || currentUrl.startsWith('/report/');
      const routeData = this.router.routerState.snapshot.root.firstChild?.data as { showSideMenu?: boolean };
      this.showSideMenu = routeData ? routeData['showSideMenu'] !== false : true && !this.reportPageActive;
    });  
  }

  ngOnInit(): void {
    
    this.checkDarkModeStatus();
    
    const storedRequestStatus = localStorage.getItem('request_status');
   
    if (storedRequestStatus !== null) {
        this.request_status = storedRequestStatus;
    } else {
        this.request_status = "default_value";
    }

    const user_id = localStorage.getItem('user_id');
    if (user_id !== null) {
      this.id = user_id;
  } else {
      this.request_status = "default_value";
  }

  if(user_id){
  this.getUserInfo(this.id);
  
  }

  
  }

  
  

  checkRequestStatus(){
    this.userService.getRequestStatus(this.user.lau_email).subscribe(async (response) => {
    
      const parsedResponse = JSON.parse(JSON.stringify(response));
        const status = parsedResponse.status;
        if(status == "pending"){
          const toast = await this.toastController.create({
            message: "Your request is still pending",
            duration: 2000,
            position: 'bottom'
          });
          toast.present();

        }else if(status == "rejected"){
          this.rejected = true;
          const toast = await this.toastController.create({
            message: "Your request was rejected",
            duration: 2000,
            position: 'bottom'
          });
          toast.present();

        }else if(status == "accepted"){
 this.router.navigate(["./tabs/report-emergency"])
        }
    });
  }

  getUserInfo(id: string) {
    
    this.userService.getUserInfo(id)
    .subscribe({
      next: (response) => {
        console.log("Fetched user data:", response);
        this.user = response['User'];
        this.user_rank = this.getUserRankName(this.user.user_rank);
      
        this.profile_picture = this.user.profile_picture;
      },
      error: (error) => {
        console.error("Error getting user info:", error);
      },
      complete: () => {
      }
    });
  }


  getUserRankName(rankNumber: string): string {
    switch (rankNumber) {
      case '1':
        return 'Dispatcher';
      case '2':
        return 'Medic';
      case '3':
        return 'Admin';
      case '4':
        return 'Medic & Admin';
      case '5':
        return 'Dispatcher & Admin';
      case '6':
        return 'Dispatcher & Medic';
      default:
        return 'Unknown'; 
    }
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
              this.userService.apply(data.id, data.number, data.major)
              .subscribe({
                next: (response) => {
                  console.log("User applied successfully:", response);
                },
                error: (error) => {
                  console.error("Error applying:", error);
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
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Logout',
          cssClass: 'alert-button-ok-red',
          handler: () => { 
             this.userService.logout().subscribe((data: any) => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('first_name');
            localStorage.removeItem('last_name');
            localStorage.removeItem('profile_picture'); 
            localStorage.removeItem('lau_email');
            localStorage.removeItem('user_type');
            localStorage.removeItem('request_status');
            
          });
          this.router.navigate(["./login"])
          
        }
           
        },
      ],
    });
    await alert.present();
  }
}
