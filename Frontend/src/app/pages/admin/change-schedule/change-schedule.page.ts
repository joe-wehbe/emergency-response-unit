import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-change-schedule',
  templateUrl: './change-schedule.page.html',
  styleUrls: ['./change-schedule.page.scss'],
})
export class ChangeSchedulePage implements OnInit {

  selectedOption: string = 'monday';

  constructor(private alertController:AlertController, private router:Router, private modalController:ModalController) { }

  ngOnInit() {
  }

  async back() {
    const alert = await this.alertController.create({
      header: 'Discard Changes?',
      subHeader: 'Are you sure you want to discard any changes you made?',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Discard',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            this.router.navigate(["./user-profile"])
          },
        },
      ],
    });
    await alert.present();
  }

  dismiss(){
    this.modalController.dismiss();
  }

  add(){
  }

  async deleteAlert() {
    const alert = await this.alertController.create({
      header: 'Delete Shift?',
      subHeader: 'Are you sure you want to permanently delete this shift?',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Delete',
          cssClass: 'alert-button-ok-red',
        },
      ],
    });
    await alert.present();
  }

  async saveAlert() {
    const alert = await this.alertController.create({
      header: 'Save Changes?',
      subHeader: 'Are you sure you want to save the changes you made?',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Save',
          cssClass: 'alert-button-ok-green',
          handler: () =>{
            this.router.navigate(["/user-profile"])
          }
        },
      ],
    });
    await alert.present();
  }

}
