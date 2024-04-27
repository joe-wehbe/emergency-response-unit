import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';
import { FcmService } from 'src/app/services/firebase/fcm.service';

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

  constructor(
    public alertController: AlertController, 
    private toastController:ToastController,
    private emergencyService:EmergencyService,
    private fcmService: FcmService
  ) {}

  ngOnInit() {}

  async reportEmergencyAlert() {
    if (this.isButtonClicked) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Emergency Alert',
      subHeader: 'Please provide emergency information',
      cssClass: "alert-dialog",
      mode: "ios",

      inputs: [
        {
          name: 'location',
          type: 'text',
          placeholder: 'Location...',
          cssClass: 'location-input',
          attributes: {
            required: true,
            maxlength: 20,
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
              this.emergencyService.reportEmergency(data.location, data.description)
              .subscribe({
                next: (response) => {
                  console.log("Emergency reported successfully:", response);
                  this.sendSOS();
                  this.fcmService.notifyResponders(data.location, data.description);
                },
                error: (error) => {
                  console.error("Error reporting emergency:", error);
                },
                complete: () => {
                }
              });
              return true;
            }
          },
        },
      ],
    });
    await alert.present();
  }

  sendSOS() {
    this.notifyingStatement = 'Notifying medics...';
    this.firstH4Content = "We will let you know";
    this.secondH4Content = "when a medic responds";
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
