import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-emergency-details',
  templateUrl: './emergency-details.page.html',
  styleUrls: ['./emergency-details.page.scss'],
})
export class EmergencyDetailsPage implements OnInit {

  HeartRate: number = 120;
  RespirationRate: number = 27;
  BloodSaturation: number = 92;
  CapillaryRefill: number = 4;
  Temperature: number = 38.6;
  HemoGlucoTest: number = 40;
  Systolic: number = 160;
  Diastolic: number = 70;

  constructor(private router:Router) { }

  ngOnInit() {
  }

  back(){
    this.router.navigate(["./standby"])
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

}
