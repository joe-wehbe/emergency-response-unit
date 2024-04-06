import { Component, ElementRef, OnInit, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-manage-announcements',
  templateUrl: './manage-announcements.page.html',
  styleUrls: ['./manage-announcements.page.scss'],
})
export class ManageAnnouncementsPage implements OnInit {
  announcements: any[] = [];
  modalElements!: QueryList<ElementRef>;
  modals: IonModal[] = [];


  constructor(private adminService:AdminService, private router:Router, public modalController: ModalController, public alertController: AlertController) { 
   
  }

  ngOnInit() {
    this.adminService.get_announcements().subscribe(response => {
      this.announcements =   Object.values(response);
      console.log(this.announcements);
    });
  }

  

  receiverSelectedOption: string = 'all-members';
  importanceSelectedOption: string = 'very-important';

  truncateDescription(description: string, limit: number): string {
    if (description.length > limit) {
      return description.slice(0, limit) + '...';
    } else {
      return description;
    }
  }

  back(){
    this.router.navigate(['/admin-panel']);
  }
  
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Delete Announcement',
      subHeader: 'Are you sure you want to permanently delete this announcement?',
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
            this.modalController.dismiss();
            this.router.navigate(["./manage-announcements"])
          },
        },
      ],
    });
    await alert.present();
  }

  dismiss(){
    this.modalController.dismiss();
  }

  send(announcementForm: NgForm) {
    if (announcementForm.valid) {
      this.dismiss();
    }
  }

  formatDate(created_at: string): string {
    const currentDate = new Date();
    const postDate = new Date(created_at);

    const difference = currentDate.getTime() - postDate.getTime();
    const minutesDifference = Math.round(difference / (1000 * 60));
    const secondsDifference = Math.round(difference / 1000);

    if (secondsDifference < 60) {
      return secondsDifference === 1 ? '1 second ago' : `${secondsDifference} seconds ago`;
    }

    if (minutesDifference < 60) {
      return minutesDifference === 1 ? '1 minute ago' : `${minutesDifference} minutes ago`;
    }

    const hoursDifference = Math.round(minutesDifference / 60);

    if (hoursDifference < 24) {
      return hoursDifference === 1 ? '1 hour ago' : `${hoursDifference} hours ago`;
    }

    const daysDifference = Math.round(hoursDifference / 24);
    return daysDifference === 1 ? '1 day ago' : `${daysDifference} days ago`;
  }

  openModal(modal: IonModal){
    modal.present();
  }
}
