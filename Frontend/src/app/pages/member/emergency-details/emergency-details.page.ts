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
  assessments: any[] = [];

  constructor(private router:Router, private route:ActivatedRoute, private emergencyService:EmergencyService) { }

  ngOnInit() {
    this.getEmergency();
    this.getEmergencyAssessments();
  }

  getEmergency() {
    this.route.params.subscribe(params => {
      this.emergencyId = params['id'];

      this.emergencyService.getEmergency(this.emergencyId)
        .subscribe({
          next: (response) => {
            console.log("Fetched emergency data:", response);
            this.emergency = (response as any).emergency;
          },
          error: (error) => {
            console.error("Error getting emergency info:", error);
          },
        });
    });
  }

  getEmergencyAssessments(){
    this.route.params.subscribe(params => {
      this.emergencyId = params['id'];

      this.emergencyService.getEmergencyAssessments(this.emergencyId)
        .subscribe({
          next: (response) => {
            console.log("Fetched Ongoing emergencies: ", response);
            const parsedResponse = JSON.parse(JSON.stringify(response));
            this.assessments = [].concat.apply([], Object.values(parsedResponse['assessments']));
          },
          error: (error) => {
            console.error("Error getting emergency assessments:", error);
          },
        });
    });
  }


  back(){
    this.router.navigate(["./tabs/standby"])
  }

  // handleRefresh(event: any) {
  //   this.getEmergency();
  //   setTimeout(() => {
  //     event.target.complete();
  //   }, 2000);
  // }
}
