import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';

@Component({
  selector: 'app-standby',
  templateUrl: './standby.page.html',
  styleUrls: ['./standby.page.scss'],
})
export class StandbyPage implements OnInit {
  
  selectedSegment: string = 'Ongoing';
  ongoingEmergencies: any = [];
  endedEmergencies: any = [];

  constructor(
    private router:Router, 
    private alertController:AlertController,
    private emergencyService:EmergencyService) { }

  ngOnInit() {
    this.getOngoingEmergencies();
    this.getEndedEmergencies();
  }

  getOngoingEmergencies() {
    this.emergencyService.getOngoingEmergencies()
      .subscribe({
        next: (response) => {
  
          if(response && response.hasOwnProperty("emergencies")){
            console.log("Fetched Ongoing emergencies: ", response);
            const parsedResponse = JSON.parse(JSON.stringify(response));
            this.ongoingEmergencies = [].concat.apply([], Object.values(parsedResponse['emergencies']));
          }
          else{
            console.log("No ongoing emergencies");
          }
        },
        error: (error) => {
          console.error("Error retrieving ongoing emergencies:", error);
        }
      });
  }
  
  getEndedEmergencies() {
    this.emergencyService.getEndedEmergencies()
      .subscribe({
        next: (response) => {
          if (response && response.hasOwnProperty("emergencies")) {
            console.log("Fetched ended emergencies: ", response);
            const parsedResponse = JSON.parse(JSON.stringify(response));
            this.endedEmergencies = [].concat.apply([], Object.values(parsedResponse['emergencies']));

          } else {
            console.log("No ended emergencies");
          }
        },
        error: (error) => {
          console.error("Error retrieving ended emergencies:", error);
        }
      });
  }

  openActionSheet(emergencyId: number) {
    const actionSheet = document.createElement('ion-action-sheet');

    actionSheet.header = 'Select';
    actionSheet.buttons = [
      {
        text: 'Submit case report',
        data: {
          action: 'report',
        },
        handler: () => {
          this.router.navigate(['/case-report-form', emergencyId], { queryParams: { from: 'tabs/standby' } });
        },
      },
      {
        text: 'Emergency details',
        data: {
          action: 'details',
        },
        handler: () => {
          this.navigateEmergencyDetails(emergencyId);      
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
          this.deleteEmergencyAlert(emergencyId);
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
    document.body.appendChild(actionSheet);
    actionSheet.present();
  }

  async deleteEmergencyAlert(emergencyId:number) {
    const alert = await this.alertController.create({
      header: 'Delete Emergency',
      subHeader: 'Delete an emergency if you do not need to submit its case report form!',
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
          handler: () => {
            this.emergencyService.deleteEmergency(emergencyId)
            .subscribe({
              next: (response) => {
                console.log("Emergency deleted successfully: ", response);
              },
              error: (error) => {
                console.error("Error deleting emergency:", error);
              }
            });
          },
        },
      ],
    });
    await alert.present();
  }

  navigateEmergencyDetails(emergencyId: number){
    this.router.navigate(["./emergency-details", emergencyId])
  }

}
