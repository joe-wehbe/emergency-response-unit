import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-case-report-form',
  templateUrl: './case-report-form.page.html',
  styleUrls: ['./case-report-form.page.scss'],
})
export class CaseReportFormPage implements OnInit {

  patientName: string = "";
  location: string = "";
  patientCondition: string = "Serious";
  otherPatientCondition: string = "";
  history: string = "";
  treatmentAdministration: string ="first responder team";
  otherTreatmentAdministration: string="";
  transportation: string = "lau clinic";
  otherTransportation: string = "";
  consultation: string = "yes";
  otherConsultation: string = "";
  equipment: string = "";
  issues: string = "yes";
  otherInput: string = ''; 
  emergency: any;
  emergencyId:number = 0;
  previousRoute: string = '/case-report';
  isLoading: boolean = false;

  constructor(
    private router:Router, 
    private route: ActivatedRoute, 
    private emergencyService: EmergencyService, 
    private userService: UserService,
    private toastController:ToastController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.previousRoute = params['from']  || '/case-report';
    });
    this.getEmergency();
  }

  getEmergency() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      this.emergencyId = params['id'];

      this.emergencyService.getEmergency(this.emergencyId)
        .subscribe({
          next: (response) => {
            console.log("Fetched emergency data:", response);
            this.emergency = (response as any).emergency;
            this.patientName = this.emergency.patient_name;
            this.location = this.emergency.location;

            if(this.emergency.patient_condition == 'Serious' || 
            this.emergency.patient_condition == 'Not Serious' || 
            this.emergency.patient_condition == null){
  
              this.patientCondition = this.emergency.patient_condition;
            }
            else{
              this.patientCondition = "other";
              this.otherPatientCondition = this.emergency.patient_condition;
            }
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

  addCaseReport(){
    if(this.emergencyId && this.patientName && this.location && this.patientCondition && 
      this.history && this.treatmentAdministration && this.transportation && this.equipment && this.consultation && this.issues){

      this.userService.addCaseReport(this.emergencyId, this.patientName, this.location,
        this.patientCondition == "other" ? this.otherPatientCondition : this.patientCondition,this.history,
        this.treatmentAdministration == "other" ? this.otherTreatmentAdministration : this.treatmentAdministration,
        this.transportation == "other" ? this.otherTransportation : this.transportation,this.equipment, 
        this.consultation == "other" ? this.otherConsultation : this.consultation, this.issues)
        .subscribe({
          next: (response) => {
            console.log('Case submitted successfully:', response);
            this.router.navigate(["./case-reports"]).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Error sumbitting:', error);
          },
        });
    }
    else{
      this.presentToast("All fields are required");
    }
  }

  async presentToast(message:string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  optionSelected() {
    if (this.patientCondition !== 'other' || this.treatmentAdministration !== 'other' || this.transportation !== 'other' || this.consultation !== 'other' || this.issues !== 'other') {
      this.otherInput = '';
    }
  }

  enableSelectionPC(){
    this.patientCondition="";
  }

  enableSelectionTA(){
    this.treatmentAdministration="";
  }

  enableSelectionT(){
    this.transportation="";
  }

  enableSelectionC(){
    this.consultation="";
  }

  back(){
    this.router.navigate([this.previousRoute]);
  }
}
