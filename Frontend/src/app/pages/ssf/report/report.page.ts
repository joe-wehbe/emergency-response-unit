import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  isButtonClicked = false;
  notifyingStatement: string = '';
  firstH4Content: string = 'Press the button below';
  secondH4Content: string = 'to notify medics';

  constructor(private alertController: AlertController, private toastController:ToastController) {}

  ngOnInit() {}

  async presentAlert() {
    if (this.isButtonClicked) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Emergency Alert',
      subHeader: 'Please provide emergency information',
      cssClass: "alert-dialog",
      mode: 'ios',

      inputs: [
        {
          name: 'location',
          type: 'text',
          placeholder: 'Location...',
          cssClass: 'location-input',
          attributes: {
            required: true,
          },
        },

        {
          name: 'description',
          type: 'text',
          placeholder: 'Description...',
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
          text: 'Report',
          cssClass: 'alert-button-ok-red',
          handler: async(data) => {
            if(!data.location && !data.description){
              const message = 'Please specify emergency location and description';
              const toast = await this.toastController.create({
                message: message,
                duration: 2000, 
                position: 'bottom'
              });
              toast.present();
              return false;
            }
            if(!data.location){
              const message = 'Please specify the emergency location';
              const toast = await this.toastController.create({
                message: message,
                duration: 2000, 
                position: 'bottom'
              });
              toast.present();
              return false;
            }
            if(!data.description){
              const message = 'Please provide a description';
              const toast = await this.toastController.create({
                message: message,
                duration: 2000, 
                position: 'bottom'
              });
              toast.present();
              return false;
            }
            else{
              this.sendSOS();
              this.notifyingStatement = 'Notifying medics...';
              this.firstH4Content = "We will let you know";
              this.secondH4Content = "when a medic responds";
              return true;
            }
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
      this.firstH4Content = "Dial #3934 from a nearby";
      this.secondH4Content = "campus phone or try again!";
    }, 60000);
  }
}
