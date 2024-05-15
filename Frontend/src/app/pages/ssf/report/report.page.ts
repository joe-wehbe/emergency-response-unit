import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';
import { FcmService } from 'src/app/services/firebase/fcm.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  emergency: any;
  emergencyId: number = 0;
  intervalTimer: any;
  statement: string = 'Press the button below to notify medics';
  notifyingStatement: string = '';
  medicResponded: boolean = false;
  isButtonClicked = false;

  constructor(
    private alertController: AlertController, 
    private toastController:ToastController, 
    private emergencyService:EmergencyService,
    private fcmService:FcmService,
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
      mode: 'ios',
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
              this.presentToast("Please specify emergency location and description")
              return false;
            }
            if(!data.location){
              this.presentToast('Please specify emergency location')
              return false;
            }
            if(!data.description){
              this.presentToast('Please specify emergency description');
              return false;
            }
            else{
              this.emergencyService.reportEmergency(data.location, data.description)
              .subscribe({
                next: (response) => {
                  this.emergencyId = (response as any)['emergencyId'];
                  this.sendSOS(this.emergencyId);
                  this.fcmService.notifyFirstResponders(data.location, data.description);
                },
                error: (error) => {
                  console.error("Error reporting emergency:", error);
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

  sendSOS(emergencyId: number) {
    this.statement = "We will let you know when a medic responds";
    this.notifyingStatement = 'Notifying medics...';
    this.isButtonClicked = true;

    // For SOS button animation
    const sosButton = document.querySelector('.sos-button');
    if (sosButton) {
      sosButton.classList.add('clicked');
      setTimeout(() => {
        sosButton.classList.remove('clicked');
      }, 500);
    }
  
    // To terminate checking for medic response and animation
    const Timeout = setTimeout(() => {
      clearInterval(this.intervalTimer);
      this.statement = "Dial #3934 from a nearby campus phone or try again!";
      this.notifyingStatement = 'No medics responded!';
      this.isButtonClicked = false;
    }, 120000); 
  
    // Checking for medic response each 5 seconds for 2 minutes
    this.intervalTimer = setInterval(() => {
      this.emergencyService.checkMedicResponse(emergencyId)
      .subscribe({
        next: (response) => {
          this.emergency = (response as any)['Emergency'];
          if (this.emergency.medic_id != null) {
            this.medicResponded = true;
            this.statement = "Hang on! the emergency unit has been notified";
            this.notifyingStatement = 'A medic is on the way!';
            clearInterval(this.intervalTimer); 
            clearTimeout(Timeout); 
          }   
        },
        error: (error) => {
          console.error("Error checking for medic response:", error);
        }
      });
    }, 5000);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
