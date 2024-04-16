import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-on-scene',
  templateUrl: './on-scene.page.html',
  styleUrls: ['./on-scene.page.scss'],
})
export class OnScenePage implements OnInit {

  noResponseEmergencies: any[] = [];
  isLoading: boolean = false;
  user_rank:string = "";
  id:string = "";
  constructor(
    private router:Router, 
    public alertController: AlertController, 
    private emergencyService:EmergencyService
  ) { }

  ngOnInit() {
    const medic_id = localStorage.getItem('user_id');
    if (medic_id !== null) {
      this.id = medic_id;
  } else {
      this.id = "";
  }
  this.callApi(this.id);
   
    const rank = localStorage.getItem('rank');
    if (rank !== null) {
        this.user_rank = rank;
    } else {
        this.user_rank = "";
    }
        
  }

  callApi(id: string){
    this.emergencyService.getOngoingForMedic(this.id).subscribe(
      (response: any) => {
        if(response.emergency){
        this.router.navigate(["./medic-emergency-details", response.emergency.id])
        }
      },
      (error: HttpErrorResponse) => {
        
        if (error.status === 404 && error.error && error.error.nothing) {
          this.getNoResponseEmergencies();
        
        } else {
       
          console.error("An error occurred while fetching ongoing emergency:", error.statusText);
        }
       
      }
    );
  }

  checkCondition(): boolean {
  
    return (this.user_rank === 'Medic' || this.user_rank === 'Medic & Admin' || this.user_rank == 'Dispatcher & Medic');
}

  getNoResponseEmergencies(){
    this.isLoading = true;
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
      },
      complete: () => {
        this.isLoading = false;
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
