import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-medical-faq',
  templateUrl: './medical-faq.page.html',
  styleUrls: ['./medical-faq.page.scss'],
})
export class MedicalFAQPage implements OnInit {

  constructor(private router:Router, private alertController: AlertController, private modalController: ModalController) { }

  ngOnInit() {
  }

  back(){
    this.router.navigate(['/admin-panel']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Delete FAQ',
      subHeader: 'Are you sure you want to permanently delete this FAQ?',
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

  add(){
    this.modalController.dismiss();
  }
  
}
