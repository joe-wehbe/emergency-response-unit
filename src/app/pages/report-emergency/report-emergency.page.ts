import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-report-emergency',
  templateUrl: './report-emergency.page.html',
  styleUrls: ['./report-emergency.page.scss'],
})
export class ReportEmergencyPage implements OnInit {

  isButtonClicked = false;
  notifyingStatement: string = '';
  firstH4Content: string = 'Press the button below';
  secondH4Content: string = 'to notify medics';

  constructor(public alertController: AlertController) {}

  ngOnInit() {}

  async presentAlert() {
    if (this.isButtonClicked) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Emergency Alert',
      subHeader: 'Please provide emergency information',
      cssClass: "alert-dialog",

      inputs: [
        {
          name: 'Location',
          type: 'text',
          placeholder: 'Location...',
          cssClass: 'location-input',
        },

        {
          name: 'Description',
          type: 'text',
          placeholder: 'Description...',
          cssClass: 'description-input'
        },
      ],

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('Cancelled');
          },
        },
        {
          text: 'Send',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            this.sendSOS();
            this.notifyingStatement = 'Notifying medics...';
            this.firstH4Content = "We will let you know";
            this.secondH4Content = "when a medic responds";
          },
        },
      ],
    });
    await alert.present();
  }

  sendSOS() {
    this.isButtonClicked = true;
    const sosButton = document.querySelector('.sos-button');
    if (sosButton) {
      sosButton.classList.add('clicked');
      setTimeout(() => {
        sosButton.classList.remove('clicked');
      }, 500);
    }

    setTimeout(() => {
      this.isButtonClicked = false;
      this.notifyingStatement = 'No medics responded!';
      this.firstH4Content = "Try directly contacting";
      this.secondH4Content = "medics or try again!";
    }, 60000);
  }
}
