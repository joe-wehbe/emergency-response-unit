import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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
}
