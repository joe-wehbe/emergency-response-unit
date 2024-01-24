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
    const alert = await this.alertController.create({
      header: 'Emergency Alert',
      subHeader: 'Please provide emergency information',
      cssClass: 'custom-alert',

      inputs: [
        {
          name: 'Location',
          type: 'text',
          placeholder: 'Location...',
        },

        {
          name: 'Description',
          type: 'text',
          placeholder: 'Description...',
        },
      ],

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled');
          },
        },
        {
          text: 'Send',
          handler: (data) => {
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
  }

}
