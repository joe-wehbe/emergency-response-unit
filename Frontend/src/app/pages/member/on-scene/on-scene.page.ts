import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';

@Component({
  selector: 'app-on-scene',
  templateUrl: './on-scene.page.html',
  styleUrls: ['./on-scene.page.scss'],
})
export class OnScenePage implements OnInit {

  noResponseEmergencies: any[] = [];

  constructor(
    private router:Router, 
    public alertController: AlertController, 
    private emergencyService:EmergencyService
  ) { }

  ngOnInit() {
    this.getNoResponseEmergencies();
  }

  getNoResponseEmergencies(){
    this.emergencyService.getNoResponseEmergencies()
    .subscribe({
      next: (response) => {
        if(response && response.hasOwnProperty("emergencies")){
          console.log("Fetched no response emergencies: ", response);
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.noResponseEmergencies = [].concat.apply([], Object.values(parsedResponse['emergencies']));
        }
        else{
          console.log("No emergencies without response");
        }
      },
      error: (error) => {
        console.error("Error retrieving no response emergencies:", error);
      }
    });
  }

  async acceptAlert(emergencyId: number) {
    const alert = await this.alertController.create({
      header: 'Accept Emergency?',
      subHeader: 'Emergency reporter and standbys will be notified that you are on the way',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Accept',
          cssClass: 'alert-button-ok-green',
          handler: () => {
            this.emergencyService.acceptEmergency(emergencyId)
            .subscribe({
              next: (response) => {
                console.log("Emergency accepted:", response);
                this.router.navigate(["./medic-emergency-details", emergencyId])
              },
              error: (error) => {
                console.error("Error accepting emergency:", error);
              },
              complete: () => {
              }
            });
            return true;            
          },
        },
      ],
    });
    await alert.present();
  }
}
