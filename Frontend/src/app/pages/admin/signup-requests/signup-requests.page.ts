import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-signup-requests',
  templateUrl: './signup-requests.page.html',
  styleUrls: ['./signup-requests.page.scss'],
})
export class SignupRequestsPage implements OnInit {

  requests: any[] = [];

  constructor( 
    private router:Router, 
    private alertController: AlertController,
    private adminService: AdminService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.requests = [];
    this.getSignupRequests();
  }

  getSignupRequests(){
    this.adminService.getSignupRequests()
    .subscribe({
      next: (response) => {
        if(response && response.hasOwnProperty("requests")){
          console.log("Fetched signup requests:", response);
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
    });
  }

  acceptSignupRequest(requestId: number){
    this.adminService.acceptSignupRequest(requestId)
    .subscribe({
      next: () => {
        console.log("Signup request accepted");
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
        console.log("Signup request rejected");
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
