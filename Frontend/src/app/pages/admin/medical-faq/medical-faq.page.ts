import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

interface FAQ {
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

  medical_faqs: FAQ[] = [];
  type: string = "";
  question: string = "";
  answer: string = "";

  constructor(
    private toastController: ToastController, 
    private adminService:AdminService, 
    private route:ActivatedRoute, 
    private router:Router, 
    private alertController: AlertController, 
    private modalController: ModalController,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.getMedicalFAQs();
  }

  getMedicalFAQs() {
    this.route.params.subscribe(params => {
      this.type = params['type']; 
      this.userService.getMedicalFAQs(this.type).subscribe(response => {
        const faqs = Object.values(response).reduce((acc: any[], curr: any[]) => acc.concat(curr), []); 
        this.medical_faqs = faqs.map((faq: {id: number, type: string, question: string, answer: string}) => ({ 
          id : faq.id,
          type: faq.type,
          question: faq.question,
          answer: faq.answer
        }));
     });
   });
  }

  addFaq() {
    this.adminService.addFaq(this.type, this.question, this.answer)
    .subscribe({
      next: (response) => {
        console.log('FAQ added:', response);
        this.presentToast("FAQ added")
        this.question = '';
        this.answer = '';
        this.dismiss();
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error deleting faq:', error);
      },
    });
  }

  async deleteAlert(id: number) {
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
            this.deleteFaq(id);
          }
        },
      ],
    });
    await alert.present();
  }

  deleteFaq(id:number){
    this.adminService.deleteFaq(id)
    .subscribe({
      next: (response) => {
        console.log('FAQ deleted:', response);
        this.presentToast("FAQ deleted")
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error deleting faq:', error);
      },
    });
  }

  async presentToast(message:string){
    const toast = await this.toastController.create({
         message: message,
         duration: 2000, 
         position: 'bottom'
    });
    toast.present();
  }

  dismiss(){
    this.modalController.dismiss();
  }

  back(){
    this.router.navigate(['/manage-faqs']);
  }
}
