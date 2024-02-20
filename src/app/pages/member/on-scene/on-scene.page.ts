import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-on-scene',
  templateUrl: './on-scene.page.html',
  styleUrls: ['./on-scene.page.scss'],
})
export class OnScenePage implements OnInit {

  constructor(private router:Router, public alertController: AlertController) { }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Accept Emergency?',
      subHeader: 'The emergency reporter and standbys will be notified that you are on the way',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Accept',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            this.router.navigate(["./medic-emergency-details"])
          },
        },
      ],
    });
    await alert.present();
  }

}
