import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-case-report-form',
  templateUrl: './case-report-form.page.html',
  styleUrls: ['./case-report-form.page.scss'],
})
export class CaseReportFormPage implements OnInit {

  patient_name: string = "";
  location: string = "";
  patient_condition: string = "Serious";
  history: string = "";
  treatment_administration: string ="first responder team";
  transportation: string = "lau clinic";
  consultation: string = "yes";
  equipment: string = "";
  issues: string = "yes";
  otherInput: string = ''; 

  emergency: any;
  emergencyId:number = 0;
  previousRoute: string = '/case-report';

  constructor(
    private router:Router, 
    private route: ActivatedRoute, 
    private emergencyService: EmergencyService, 
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.previousRoute = params['from']  || '/case-report';
    });
    this.getEmergency();
  }
 
  optionSelected() {
    if (this.patient_condition !== 'other' || this.treatment_administration !== 'other' || this.transportation !== 'other' || this.consultation !== 'other' || this.issues !== 'other') {
      this.otherInput = '';
    }
  }

  back(){
    this.router.navigate([this.previousRoute]);
  }

  addCaseReport(){
    this.userService.addCaseReport(this.emergencyId, this.patient_name, this.location, this.patient_condition, 
      this.history, this.treatment_administration, this.transportation, this.equipment, this.consultation, this.issues).subscribe({
      next: (response) => {
        console.log('Case submitted successfully:', response);
        this.router.navigate(["./case-reports"])
      },
      error: (error) => {
        console.error('Error sumbitting:', error);
      },
    });
  }

  getEmergency() {
    this.route.params.subscribe(params => {
      this.emergencyId = params['id'];

      this.emergencyService.getEmergency(this.emergencyId)
        .subscribe({
          next: (response) => {
            console.log("Fetched emergency data:", response);
            this.emergency = (response as any).emergency;
            this.patient_name = this.emergency.patient_name;
            this.location = this.emergency.location;
            this.patient_condition = this.emergency.patient_condition;
          },
          error: (error) => {
            console.error("Error getting emergency info:", error);
          },
        });
    });
  }
}
