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
  isLoading: boolean = false;

  constructor(private router:Router, private route:ActivatedRoute, private emergencyService:EmergencyService) { }

  ngOnInit() {
    this.getEmergency();
    this.getEmergencyAssessments();
  }

  getEmergency() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      this.emergencyId = params['id'];
      this.emergencyService.getEmergency(this.emergencyId)
        .subscribe({
          next: (response) => {
            this.emergency = (response as any).emergency;
          },
          error: (error) => {
            console.error("Error getting emergency info:", error);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    });
  }

  getEmergencyAssessments(){
    this.route.params.subscribe(params => {
      this.emergencyId = params['id'];
      this.emergencyService.getEmergencyAssessments(this.emergencyId)
        .subscribe({
          next: (response) => { 
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
}
