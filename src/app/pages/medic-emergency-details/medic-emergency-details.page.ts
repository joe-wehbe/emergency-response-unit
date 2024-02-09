import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medic-emergency-details',
  templateUrl: './medic-emergency-details.page.html',
  styleUrls: ['./medic-emergency-details.page.scss'],
})
export class MedicEmergencyDetailsPage implements OnInit {

  constructor(private router:Router, public alertController: AlertController) { }

  ngOnInit() {
  }

  selectedOption: string = 'serious';
  otherInput: string = '';

  optionSelected() {
    if (this.selectedOption !== 'other') {
      this.otherInput = '';
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'End Emergency?',
      subHeader: 'Patient and vitals records will be available',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'End',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            this.router.navigate(["./on-scene"])
          },
        },
      ],
    });
    await alert.present();
  }

}
