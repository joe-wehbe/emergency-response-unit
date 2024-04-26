import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';

@Component({
  selector: 'app-medic-emergency-details',
  templateUrl: './medic-emergency-details.page.html',
  styleUrls: ['./medic-emergency-details.page.scss'],
})
export class MedicEmergencyDetailsPage implements OnInit {

  emergencyId: any;
  emergency: any;
  assessment: any;

  patientName: string = "";
  patientId: number | null = null;
  medicDescription: string = "";
  patientCondition: string = "";
  otherPatientCondition: string = "";

  heart_rate: number | null = null;
  blood_pressure: string = "";
  oxygen_saturation: number | null = null;
  temperature: number | null = null;
  respiration_rate: number | null = null;
  capillary_refill_time: number | null = null;
  hemoglucotest: number | null = null;
  pupils_reaction: string = "";
  assessmentsCount: number = 1;

  isLoading: boolean = false;

  constructor(
    private router:Router, 
    public alertController:AlertController,
    private route:ActivatedRoute,
    private toastController:ToastController,
    public emergencyService:EmergencyService
  ) { }

  ngOnInit() {
    
    this.route.params.subscribe(params => {
      this.emergencyId = params['id'];
    });
    this.getEmergencyWithLastAssessment();
    const storedCount = localStorage.getItem(`assessmentsCount${this.emergencyId}`);
    this.assessmentsCount = storedCount ? parseInt(storedCount) : 1;
  }

  getEmergencyWithLastAssessment(){
    this.isLoading = true;
    this.emergencyService.getEmergencyWithLastAssessment(this.emergencyId)
      .subscribe({
        next: (response) => {

          this.emergency = (response as any).emergency;
          this.assessment = (response as any).last_assessment;

          this.patientName = this.emergency.patient_name;
          this.patientId = this.emergency.patient_lau_id;
          this.medicDescription = this.emergency.medic_description;

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
  }

  addEmergencyDetails(){
    if(!this.patientName && !this.patientId && !this.medicDescription && 
      this.patientCondition? !this.otherPatientCondition : !this.patientCondition){
      this.presentToast("At least one field should not be empty");

    } else {
    
      
      this.emergencyService.addEmergencyDetails(this.emergencyId, this.patientName, 
        this.patientId !== null ? this.patientId : -1, this.medicDescription, 
        this.patientCondition == "other" ? this.otherPatientCondition : this.patientCondition
      ).subscribe({
        next: (response) => {
         
          this.presentToast("Patient information saved");
        },
        error: (error) => {
          console.error("Error adding emergency details: ", error);
        },
      });
    }
  }

  addAssessment() {
    if (!this.heart_rate && !this.blood_pressure && !this.oxygen_saturation &&!this.temperature 
      && !this.respiration_rate && !this.capillary_refill_time &&!this.hemoglucotest && !this.pupils_reaction) {
      this.presentToast("At least one field should not be empty");

    } else {
      this.emergencyService.addAssessment(this.emergencyId, this.heart_rate !== null ? this.heart_rate : -1,
        this.blood_pressure,this.oxygen_saturation !== null ? this.oxygen_saturation : -1,
        this.temperature !== null ? this.temperature : -1,this.respiration_rate !== null ? this.respiration_rate : -1,
        this.capillary_refill_time !== null ? this.capillary_refill_time : -1,this.hemoglucotest !== null ? this.hemoglucotest : -1,
        this.pupils_reaction)

      .subscribe({
        next: (response) => {
        
          this.presentToast("Assessment recorded");

          this.heart_rate= null;
          this.blood_pressure = "";
          this.oxygen_saturation = null;
          this.temperature= null;
          this.respiration_rate = null;
          this.capillary_refill_time = null;
          this.hemoglucotest = null;
          this.pupils_reaction = "";
          this.assessmentsCount++;
          localStorage.setItem(`assessmentsCount${this.emergencyId}`, this.assessmentsCount.toString());

          this.getEmergencyWithLastAssessment();
        },
        error: (error) => {
          console.error("Error adding assessment: ", error);
        },
      });
    }
  }
  
  async endEmergencyAlert() {
    const alert = await this.alertController.create({
      header: 'End Emergency?',
      subHeader: 'Patient and vitals records will be available',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'End',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            this.emergencyService.endEmergency(this.emergencyId)
            .subscribe({
              next: (response) => {
             
                localStorage.removeItem(`assessmentsCount${this.emergencyId}`);
                this.router.navigate(["./tabs/on-scene"]).then(() => {
                  window.location.reload();
                });
              },
              error: (error) => {
                console.error("Error ending emergency:", error);
              },
            });
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  enableSelection(){
    this.patientCondition="";
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
