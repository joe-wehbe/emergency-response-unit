import { Component, ViewChild, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';

interface Emergency {
  id: number;
  location: string;
  reporterDescription: string;
  patientName: string;
  patientLauId: number;
  medicDescription: string;
  patientCondition: string;
  history: string;
  treatmentAdministration: string;
  transportation: string;
  consultation: string;
  equipment: string;
  issues: string;
  medicName: string;
  date: string;
  time: string;
  heartRate: number;
  bloodPressure: string;
  respirationRate: number;
  oxygenSaturation: number;
  capillaryRefill: number;
  temperature: number;
  hemoglucotest: number;
  pupilsReaction: string;
}

@Component({
  selector: 'app-emergency-records',
  templateUrl: './emergency-records.page.html',
  styleUrls: ['./emergency-records.page.scss'],
})

export class EmergencyRecordsPage {

  allEmergencies: any[] = [];
  emergencies: Emergency[] = [];
  groupedEmergencies: { [date: string]: Emergency[] } = {};
  selectedOption: string = 'all-time';
  assessments: any[] = [];
  selectedEmergency: any;
  fromDateElement: HTMLIonDatetimeElement | null = null;
  toDateElement: HTMLIonDatetimeElement | null = null;

  @ViewChild('detailsModal') modal: IonModal | undefined;

  constructor(
    private router: Router, 
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private emergencyService:EmergencyService) {
  }

  ngOnInit(){
    this.getAllEmergenciesWithLastAssessment();
  }

  getAllEmergenciesWithLastAssessment() {
    this.emergencyService.getAllEmergenciesWithLastAssessment()
      .subscribe({
        next: (response) => {
          if (response && response.hasOwnProperty("emergencies")) {
            console.log("Fetched all emergencies: ", response);
            const parsedResponse = JSON.parse(JSON.stringify(response));
            this.allEmergencies = [].concat.apply([], Object.values(parsedResponse['emergencies']));
  
            this.allEmergencies.forEach(emergency => {
              const isoDate = new Date(emergency.emergency.created_at);
              const formattedDate = `${isoDate.getDate().toString().padStart(2, '0')}/${(isoDate.getMonth() + 1).toString().padStart(2, '0')}/${isoDate.getFullYear()}`;

              this.emergencies.push({
                id: emergency.emergency.id,
                location: emergency.emergency.location,
                reporterDescription: emergency.emergency.reporter_description,
                patientName: emergency.emergency.patient_name,
                patientLauId: emergency.emergency.patient_lau_id,
                medicDescription: emergency.emergency.medic_description,
                patientCondition: emergency.emergency.patient_condition,
                history: emergency.emergency.history,
                treatmentAdministration: emergency.emergency.treatment_administration,
                transportation: emergency.emergency.transportation,
                consultation: emergency.emergency.consultation,
                equipment: emergency.emergency.equipment,
                issues: emergency.emergency.issues,
                medicName: `${emergency.emergency.medic.first_name} ${emergency.emergency.medic.last_name}`,
                date: formattedDate,
                time: new Date(emergency.emergency.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                heartRate: emergency.last_assessment? emergency.last_assessment.heart_rate : 'N/A',
                bloodPressure: emergency.last_assessment? emergency.last_assessment.blood_pressure : 'N/A',
                respirationRate: emergency.last_assessment? emergency.last_assessment.respiration_rate : 'N/A',
                oxygenSaturation: emergency.last_assessment? emergency.last_assessment.oxygen_saturation : 'N/A',
                capillaryRefill: emergency.last_assessment? emergency.last_assessment.capillary_refill_time : 'N/A',
                temperature: emergency.last_assessment? emergency.last_assessment.temperature : 'N/A',
                hemoglucotest: emergency.last_assessment? emergency.last_assessment.hemoglucotest : 'N/A',
                pupilsReaction: emergency.last_assessment? emergency.last_assessment.pupils_reaction : 'N/A',
              })
            });
            this.groupedEmergencies = this.groupEmergenciesByDate(this.emergencies);
  
          } else {
            console.log("No emergency records");
          }
        },
        error: (error) => {
          console.error("Error retrieving emergencies:", error);
        }
      });
  }

  openModal(emergency: any) {
    this.selectedEmergency = emergency;
    console.log(this.selectedEmergency);

    this.emergencyService.getEmergencyAssessments(this.selectedEmergency.id)
    .subscribe({
      next: (response) => {
        console.log("Fetched all assessments:", response);
        const parsedResponse = JSON.parse(JSON.stringify(response));
        this.assessments = [].concat.apply([], Object.values(parsedResponse['assessments']));
      },
      error: (error) => {
        console.error("Error fetching all assessments:", error);
      },
    });
    this.modal?.present();
  }

  back() {
    this.router.navigate(['/admin-panel']);
  }

  async deleteEmergency(){
    const alert = await this.alertController.create({
      header: 'Delete emergency',
      subHeader: 'Are you sure you want to permanently delete this emergency and its records?',
      cssClass: 'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Delete',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            this.emergencyService.deleteEmergency(this.selectedEmergency.id)
            .subscribe({
              next: (response) => {
                console.log("Emergency deleted successfully:", response);
                this.modalController.dismiss();
                this.presentToast("Emergency deleted");
              },
              error: (error) => {
                console.error("Error deleting emergency:", error);
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

  dismiss(){
    this.modalController.dismiss();
  }
  
  async fetch() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
  
    let fromDate = new Date(currentYear, currentMonth - 1, 1);
    let toDate = new Date(currentYear, currentMonth, 0);
  
    switch (this.selectedOption) {
      case 'all-time':
        this.groupedEmergencies = this.groupEmergenciesByDate(this.emergencies);
        break;

      case 'this-month':
        const filteredThisMonth = this.emergencies.filter(emergency => {
          const [emergencyMonth, emergencyYear] = emergency.date.split('/').slice(1).map(Number);
          return emergencyMonth === currentMonth && emergencyYear === currentYear;
        });
        this.groupedEmergencies = this.groupEmergenciesByDate(filteredThisMonth);
        break;

      case 'select-time':
        this.fromDateElement = document.getElementById('from-date') as HTMLIonDatetimeElement;
        this.toDateElement = document.getElementById('to-date') as HTMLIonDatetimeElement;
        
        if (this.fromDateElement && this.toDateElement) {
          const fromDateValue = this.fromDateElement.value;
          const toDateValue = this.toDateElement.value;
  
          if (typeof fromDateValue === 'string') {
            fromDate = new Date(fromDateValue);
          }
  
          fromDate.setDate(1); 
          fromDate.setHours(0, 0, 0, 0); 
  
          if (typeof toDateValue === 'string') {
            toDate = new Date(toDateValue);
          } else {
            toDate = new Date(currentYear, currentMonth, 0);
          }
  
          toDate.setHours(23, 59, 59, 999);
  
          if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
            const filteredByTimeFrame = this.emergencies.filter(emergency => {
              const [emergencyDay, emergencyMonth, emergencyYear] = emergency.date.split('/').map(Number);
              const emergencyDate = new Date(emergencyYear, emergencyMonth - 1, emergencyDay);
              return emergencyDate >= fromDate && emergencyDate <= toDate;
            });
            this.groupedEmergencies = this.groupEmergenciesByDate(filteredByTimeFrame);
          }
        }
        break;
        
      default:
        break;
    }  
    await this.modalController.dismiss();
  }
  
  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    let filteredEmergencies: Emergency[] = [];
    let currentDate: Date;
    let currentMonth: number;
    let currentYear: number;
  
    switch (this.selectedOption) {
      case 'all-time':
        filteredEmergencies = this.emergencies.filter(emergency =>
          this.emergencyContainsSearchTerm(emergency, searchTerm)
        );
        break;
        
      case 'this-month':
        currentDate = new Date();
        currentMonth = currentDate.getMonth() + 1;
        currentYear = currentDate.getFullYear();

        filteredEmergencies = this.emergencies.filter(emergency => {
          const [emergencyMonth, emergencyYear] = emergency.date.split('/').slice(1).map(Number);
          return emergencyMonth === currentMonth && emergencyYear === currentYear;
        }).filter(emergency =>
          this.emergencyContainsSearchTerm(emergency, searchTerm)
        );
        break;

      case 'select-time':
        currentDate = new Date();
        currentMonth = currentDate.getMonth() + 1;
        currentYear = currentDate.getFullYear();

        let fromDate = new Date(currentYear, currentMonth - 1, 1);
        let toDate = new Date(currentYear, currentMonth, 0);

        if (this.fromDateElement && this.toDateElement) {
          console.log('From date value:', this.fromDateElement);
          console.log('To date value:', this.toDateElement);

          const fromDateValue = this.fromDateElement.value;
          const toDateValue = this.toDateElement.value;

          if (typeof fromDateValue === 'string') {
            fromDate = new Date(fromDateValue);
          }

          if (typeof toDateValue === 'string') {
            toDate = new Date(toDateValue);
          } else {
            toDate = new Date(currentYear, currentMonth, 0);
          }

          fromDate.setDate(1);
          fromDate.setHours(0, 0, 0, 0);

          toDate.setHours(23, 59, 59, 999);

          if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
            const filteredByTimeFrame = this.emergencies.filter(emergency => {
              const [emergencyDay, emergencyMonth, emergencyYear] = emergency.date.split('/').map(Number);
              const emergencyDate = new Date(emergencyYear, emergencyMonth - 1, emergencyDay);
              return emergencyDate >= fromDate && emergencyDate <= toDate;
            });
            filteredEmergencies = filteredByTimeFrame.filter(emergency =>
              this.emergencyContainsSearchTerm(emergency, searchTerm)
            );
          }
        }
        break;
      default:
        break;
    }
    this.groupedEmergencies = this.groupEmergenciesByDate(filteredEmergencies);
  }

  emergencyContainsSearchTerm(emergency: Emergency, searchTerm: string): boolean {
    return (emergency.medicName && emergency.medicName.toLowerCase().includes(searchTerm)) ||
           (emergency.patientName && emergency.patientName.toLowerCase().includes(searchTerm)) ||
           (emergency.location && emergency.location.toLowerCase().includes(searchTerm)) ||
           emergency.date.includes(searchTerm);
  }
  
  
  groupEmergenciesByDate(emergencies: Emergency[]): { [date: string]: Emergency[] } {
    const grouped: { [date: string]: Emergency[] } = {};
    emergencies.forEach(emergency => {
      if (!grouped[emergency.date]) {
        grouped[emergency.date] = [];
      }
      grouped[emergency.date].push(emergency);
    });
    return grouped;
  }
  Object = Object;

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
