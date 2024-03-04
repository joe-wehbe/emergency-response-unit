import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cover-requests',
  templateUrl: './cover-requests.page.html',
  styleUrls: ['./cover-requests.page.scss'],
})
export class CoverRequestsPage implements OnInit {

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Accept cover request',
      subHeader: 'Failing to cover this member’s shift will affect their attendance!',
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
}
