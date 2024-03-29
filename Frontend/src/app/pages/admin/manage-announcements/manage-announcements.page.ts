import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/services/admin/admin.service';
import { IonModal } from '@ionic/angular';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-manage-announcements',
  templateUrl: './manage-announcements.page.html',
  styleUrls: ['./manage-announcements.page.scss'],
})
export class ManageAnnouncementsPage implements OnInit {
  @ViewChild('modal') modal: IonModal | undefined;
  announcements: any[] = [];
  

  constructor(private adminService:AdminService, private router:Router, public modalController: ModalController, public alertController: AlertController) { 
   
  }

  ngOnInit() {
    this.adminService.get_announcements().subscribe({
      next: (response) => {
        if(response && response.hasOwnProperty("announcements")){
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.announcements = [].concat.apply([], Object.values(parsedResponse['announcements']));
        }
      },
      error: (error) => {
        console.error("Error retrieving announcements:", error);
      }
    });
  }

  receiverSelectedOption: string = 'all-members';
  importanceSelectedOption: string = 'very-important';

  truncateDescription(description: string, limit: number): string {
    if (description.length > limit) {
      return description.slice(0, limit) + '...';
    } else {
      return description ;
    }
  }

  formatDate(created_at: string): string {
    const currentDate = new Date();
    const postDate = new Date(created_at);
  
    const difference = currentDate.getTime() - postDate.getTime();
    const secondsDifference = Math.round(difference / 1000);
    const minutesDifference = Math.round(secondsDifference / 60);
    const hoursDifference = Math.round(minutesDifference / 60);
    const daysDifference = Math.round(hoursDifference / 24);
  
    // Calculate years and months difference
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const postYear = postDate.getFullYear();
    const postMonth = postDate.getMonth();
    let yearsDifference = currentYear - postYear;
    let monthsDifference = currentMonth - postMonth;
  
    if (monthsDifference < 0) {
      yearsDifference--;
      monthsDifference += 12;
    }
  
    
    if (yearsDifference > 0) {
      return yearsDifference === 1 ? '1 year ago' : `${yearsDifference} years ago`;
    } else if (monthsDifference > 0) {
      return monthsDifference === 1 ? '1 month ago' : `${monthsDifference} months ago`;
    } else if (daysDifference > 0) {
      return daysDifference === 1 ? '1 day ago' : `${daysDifference} days ago`;
    } else if (hoursDifference > 0) {
      return hoursDifference === 1 ? '1 hour ago' : `${hoursDifference} hours ago`;
    } else if (minutesDifference > 0) {
      return minutesDifference === 1 ? '1 minute ago' : `${minutesDifference} minutes ago`;
    } else {
      return secondsDifference === 1 ? '1 second ago' : `${secondsDifference} seconds ago`;
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

  openModal(id: number){
    this.modal?.present();
  }
}
