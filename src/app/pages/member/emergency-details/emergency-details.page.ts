import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-emergency-details',
  templateUrl: './emergency-details.page.html',
  styleUrls: ['./emergency-details.page.scss'],
})
export class EmergencyDetailsPage implements OnInit {

  HeartRate: number = 80;
  RespirationRate: number = 15;
  BloodSaturation: number = 96;
  CapillaryRefill: number = 2;
  Temperature: number = 37;
  HemoGlucoTest: number = 80;
  Systolic: number = 100;
  Diastolic: number = 70;

  constructor(private router:Router) { }

  ngOnInit() {
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
