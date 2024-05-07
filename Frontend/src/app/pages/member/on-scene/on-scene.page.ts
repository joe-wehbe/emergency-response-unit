import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';

@Component({
  selector: 'app-on-scene',
  templateUrl: './on-scene.page.html',
  styleUrls: ['./on-scene.page.scss'],
})
export class OnScenePage implements OnInit {

  noResponseEmergencies: any[] = [];
  isLoading: boolean = false;
  id = localStorage.getItem('user_id') ? localStorage.getItem('user_id') ?? '' : '';
  rank = localStorage.getItem('rank') ? localStorage.getItem('rank') ?? '' : '';
  
  constructor(
    private router:Router, 
    public alertController: AlertController, 
    private emergencyService:EmergencyService,
    private toastController:ToastController
  ) { }

  ngOnInit() {
    this.checkMedicStatus(this.id);      
  }

  checkMedicStatus(id: string){
    if(this.isMedic()){
      this.emergencyService.findOngoingEmergencyByMedicId(id)
      .subscribe({
        next: (response: any) => {
          if(response.emergency){
            this.router.navigate(["./medic-emergency-details", response.emergency.id])
          }
          else{
            this.getNoResponseEmergencies();
          }
        },
        error: (error) => {
          this.getNoResponseEmergencies();
          console.error('Error retrieving emergency:', error);
        },
      });
    }
  }

  isMedic(): boolean {
    if (this.rank === 'Medic' || this.rank === 'Medic & Admin' || this.rank == 'Dispatcher & Medic'){
      return true;
    }
    else{
      this.presentToast("Only medics can accept emergencies");
      return false;
    }
  }

  getNoResponseEmergencies(){
    this.isLoading = true;
    this.emergencyService.getNoResponseEmergencies()
    .subscribe({
      next: (response) => {
        if(response && response.hasOwnProperty("emergencies")){
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
              next: () => {
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
