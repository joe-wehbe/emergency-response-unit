import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin/admin.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

interface Extension {
  id: number;
  type: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-medical-faq',
  templateUrl: './medical-faq.page.html',
  styleUrls: ['./medical-faq.page.scss'],
})


export class MedicalFAQPage implements OnInit {
  medical_faqs: Extension[] = [];
type: string = "";
answer: string = "";
question: string = "";

  constructor( private toastController:ToastController, private http:HttpClient, private adminService:AdminService, private route:ActivatedRoute, private router:Router, private alertController: AlertController, private modalController: ModalController) {

   }

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.type = params['type']; 
      this.adminService.get_medical_faqs(this.type).subscribe(response => {
        const faqs = Object.values(response).reduce((acc: any[], curr: any[]) => acc.concat(curr), []); 
        this.medical_faqs = faqs.map((faq: { id: number, type: string, question: string, answer: string}) => ({ 
          id : faq.id,
          type: faq.type,
          question: faq.question,
          answer: faq.answer
        }));
  
  
      });
    });

   


  }

  back(){
    this.router.navigate(['/manage-faqs']);
  }

  async presentAlert(id: number) {
    const alert = await this.alertController.create({
      header: 'Delete FAQ',
      subHeader: 'Are you sure you want to permanently delete this FAQ?',
      cssClass:'alert-dialog',
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
            this.deleteFAQ(id);
          }
        },
      ],
    });
    await alert.present();
  }

  
  async deleteFAQ(id: number){
    try {
      await this.http.delete<any>(`http://localhost:8000/api/v0.1/admin/delete-faq/${id}`).pipe(
        catchError(async (error) => {
          console.error('Error occurred while deleting faq:', error);
          const toast = await this.toastController.create({
            message: 'Failed to delete faq',
            duration: 2000, 
            position: 'bottom'
          });
          toast.present();
          throw error;
        })
      ).toPromise();
  
      const toast = await this.toastController.create({
        message: 'FAQ deleted successfully',
        duration: 2000, 
        position: 'bottom'
      });
      toast.present();
      window.location.reload();
      
    } catch (error) {
      console.error('Error occurred while deleting extension:', error);
      const toast = await this.toastController.create({
        message: 'Failed to delete faq',
        duration: 2000, 
        position: 'bottom'
      });
      toast.present();
    }
  }


  dismiss(){
    this.modalController.dismiss();
  }

  add() {
    this.adminService.add_faq(this.type, this.question, this.answer).subscribe(response => {
      this.handleResponse(response);
    });
  }

  async handleResponse(response: any) {
    const str = JSON.stringify(response);
    const result = JSON.parse(str);
    const status = result['status'];
    if (status == "Success") {
      window.location.reload();
    } else {
      const toast = await this.toastController.create({
        message: 'Failed to add FAQ',
        duration: 2000, 
        position: 'bottom'
      });
      toast.present();
    }
  }
}
