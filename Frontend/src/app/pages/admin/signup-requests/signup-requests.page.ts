import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin/admin.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-signup-requests',
  templateUrl: './signup-requests.page.html',
  styleUrls: ['./signup-requests.page.scss'],
})
export class SignupRequestsPage implements OnInit {

  requests: any[] = [];
  permissionData: any[] = [];
  applicationsAllowed: boolean = false;
  status: number = 0;
  isLoading: boolean = false;

  constructor( 
    private router:Router, 
    private alertController: AlertController,
    private adminService: AdminService,
    private toastController: ToastController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.requests = [];
    this.checkApplicationsPermission()
    this.getSignupRequests();
  }

  checkApplicationsPermission() {
    this.userService.getApplicationsPermission()
    .subscribe({
      next: (response) => {
        console.log("Fetched applications permission", response);
        this.permissionData = (response as any)['Permission'];
        if(this.permissionData[0].status == 1){
          this.applicationsAllowed = true;
        }
      },
      error: (error) => {
        console.error("Error fetching applications permission:", error);
      }
    });
  }

  modifyApplicationsPermission() {
    this.applicationsAllowed = !this.applicationsAllowed;
    this.applicationsAllowed ? this.status = 1 : this.status = 0;

    this.adminService.modifyApplicationsPermission(this.status)
    .subscribe({
      next: (response) => {
        console.log("Updated applications permission", response);
        this.status == 1 ? this.presentToast("Applications are now open") : this.presentToast("Applications are now closed")
      },
      error: (error) => {
        console.error("Error updating applications permission:", error);
      }
    });
  }

  getSignupRequests(){
    this.isLoading = true;
    this.adminService.getSignupRequests()
    .subscribe({
      next: (response) => {
        if(response && response.hasOwnProperty("requests")){
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.requests = [].concat.apply([], Object.values(parsedResponse['requests']));
        }
        else{
          console.log("No signup requests");
        }
      },
      error: (error) => {
        console.error("Error fetching signup requests:", error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  acceptSignupRequest(requestId: number){
    this.adminService.acceptSignupRequest(requestId)
    .subscribe({
      next: () => {  
        this.presentToast("Registration request accepted");
        this.ngOnInit();
      },
      error: (error) => {
        console.error("Error accepting signup requests:", error);
      },
    });
  }

  async acceptAlert(requestId:number) {
    const alert = await this.alertController.create({
      header: 'Accept Request',
      subHeader: 'Are you sure you want to accept this sign up request?',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Accept',
          cssClass: 'alert-button-ok-green',
          handler: async() => {
            this.acceptSignupRequest(requestId);
          }
        },
      ],
    });
    await alert.present();
  }

  rejectSignupRequest(requestId: number){
    this.adminService.rejectSignupRequest(requestId)
    .subscribe({
      next: () => {
        this.presentToast("Registration request rejected");
        this.ngOnInit();
      },
      error: (error) => {
        console.error("Error rejecting signup requests:", error);
      },
    });
  }

  async rejectAlert(requestId: number) {
    const alert = await this.alertController.create({
      header: 'Reject Request',
      subHeader: 'Are you sure you want to reject this sign up request?',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Reject',
          cssClass: 'alert-button-ok-red',
          handler: async() => {
            this.rejectSignupRequest(requestId);
          }
        },
      ],
    });
    await alert.present();
  }

  async presentToast(message:string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  back(){
    this.router.navigate(['/admin-panel']);
  }
}
