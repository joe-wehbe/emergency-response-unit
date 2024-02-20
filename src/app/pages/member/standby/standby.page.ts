import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-standby',
  templateUrl: './standby.page.html',
  styleUrls: ['./standby.page.scss'],
})
export class StandbyPage implements OnInit {
  
  selectedSegment: string = 'Ongoing';

  constructor(private router:Router, public alertController: AlertController) { }

  ngOnInit() {
  }

  public actionSheetButtons = [
    {
      text: 'Case Report',
      data: {
        action: 'report',
      },
      handler: () => {
        this.router.navigate(["./case-report-form"])
      },
    },
    {
      text: 'Emergency Details',
      data: {
        action: 'details',
      },
      handler: () => {
        this.router.navigate(["./emergency-details"])
      },
    },
    {
      text: 'Delete',
      role: 'destructive',
      cssClass: 'delete-button',
      data: {
        action: 'delete',
      },
      handler: () => {
        this.presentAlert()
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Delete Case?',
      subHeader: 'Delete a case only if you do not need to submit its report form',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Delete',
          cssClass: 'alert-button-ok-red'
        },
      ],
    });
    await alert.present();
  }

  navigateEmergencyDetails(){
    this.router.navigate(["./emergency-details"])
  }

}
