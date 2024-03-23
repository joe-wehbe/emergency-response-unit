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
  emergencyAssessments: any = [];
  lastAssessments: any;

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
          console.log("Fetched Ongoing emergencies: ", response);
  
          // Retrieving the data
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.ongoingEmergencies = [].concat.apply([], Object.values(parsedResponse['emergencies']));
  
          // Displaying the newest emergencies first
          this.ongoingEmergencies.sort((a: any, b: any) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
        },
        error: (error) => {
          console.error("Error retrieving ongoing emergencies:", error);
        }
      });
  }
  
  getEndedEmergencies(){
    this.emergencyService.getEndedEmergencies()
    .subscribe({
      next: (response) => {
        console.log("Fetched ended emergencies: ", response);
      },
      error: (error) => {
        console.error("Error retrieving ended emergencies:", error);
      },
      complete: () => {
      }
    });
  }

  public actionSheetButtons = [
    {
      text: 'Case Report',
      data: {
        action: 'report',
      },
      handler: () => {
        this.router.navigate(['/case-report-form'], { queryParams: { from: 'tabs/standby' } });
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
      header: 'Delete Emergency',
      subHeader: 'Are you sure you want to permanently delete this emergency and its records?',
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
