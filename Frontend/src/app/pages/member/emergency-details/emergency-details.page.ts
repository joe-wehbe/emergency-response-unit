import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';

@Component({
  selector: 'app-emergency-details',
  templateUrl: './emergency-details.page.html',
  styleUrls: ['./emergency-details.page.scss'],
})
export class EmergencyDetailsPage implements OnInit {

  emergencyId: number = 0;
  emergency: any;

  HeartRate: number = 80;
  RespirationRate: number = 15;
  BloodSaturation: number = 96;
  CapillaryRefill: number = 2;
  Temperature: number = 37;
  HemoGlucoTest: number = 80;
  Systolic: number = 100;
  Diastolic: number = 70;

  constructor(private router:Router, private route:ActivatedRoute, private emergencyService:EmergencyService) { }

  ngOnInit() {
    this.getEmergency();
  }

  getEmergency() {

    this.route.params.subscribe(params => {
      this.emergencyId = params['id'];
    });

    this.emergencyService.getEmergency(this.emergencyId)
    .subscribe({
      next: (response) => {
        console.log("Fetched emergency data:", response);
        const parsedResponse = JSON.parse(JSON.stringify(response));
        this.emergency = [].concat.apply([], Object.values(parsedResponse['emergency']));
      },
      error: (error) => {
        console.error("Error getting user info:", error);
      },
      complete: () => {
      }
    });
  }

  back(){
    this.router.navigate(["./tabs/standby"])
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

}
