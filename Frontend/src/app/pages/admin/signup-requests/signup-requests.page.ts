import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup-requests',
  templateUrl: './signup-requests.page.html',
  styleUrls: ['./signup-requests.page.scss'],
})
export class SignupRequestsPage implements OnInit {

  constructor( private router:Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  back(){
    this.router.navigate(['/admin-panel']);
  }

  async acceptAlert() {
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
          cssClass: 'alert-button-ok-green'
        },
      ],
    });
    await alert.present();
  }

  async rejectAlert() {
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
          cssClass: 'alert-button-ok-red'
        },
      ],
    });
    await alert.present();
  }
}
