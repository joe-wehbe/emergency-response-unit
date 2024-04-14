import { Component, OnInit, ViewChild} from '@angular/core';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-manage-announcements',
  templateUrl: './manage-announcements.page.html',
  styleUrls: ['./manage-announcements.page.scss'],
})
export class ManageAnnouncementsPage implements OnInit {

  announcements: any[] = [];
  myAnnouncements: any[] = [];
  selectedAnnouncement: any;
  userId: string = localStorage.getItem("user_id") ?? '';
  visibilitySelectedOption: string = 'dispatchers';
  importanceSelectedOption: string = 'Very important';
  description: string = '';

  @ViewChild('modal') modal: IonModal | undefined;
  constructor(
    private router:Router, 
    private modalController: ModalController, 
    private alertController: AlertController,
    private userService: UserService,
    private adminService: AdminService,
    private toastController:ToastController,
  ) {}

  ngOnInit() {
    this.myAnnouncements = [];
    this.getAllAnnouncements();
  }

  getAllAnnouncements(){
    this.userService.getAllAnnouncements()
    .subscribe({
      next: (response) => {
        if(response && response.hasOwnProperty("announcements")){
          console.log("Fetched all announcements: ", response);
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.announcements = [].concat.apply([], Object.values(parsedResponse['announcements']));

          this.announcements.forEach(announcement =>{
            if(announcement.admin_id == this.userId){
              this.myAnnouncements.push(announcement);
            }
          })
        }
        else{
          console.log("No announcements");
        }
      },
      error: (error) => {
        console.error("Error retrieving announcements:", error);
      }
    });
  }
  
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
    const minutesDifference = Math.round(difference / (1000 * 60));
    const secondsDifference = Math.round(difference / 1000);
    const hoursDifference = Math.round(minutesDifference / 60);

    if (secondsDifference < 60) {
      return secondsDifference === 1 ? '1 second ago' : `${secondsDifference} seconds ago`;
    }
    if (minutesDifference < 60) {
      return minutesDifference === 1 ? '1 minute ago' : `${minutesDifference} minutes ago`;
    }
    if (hoursDifference < 24) {
      return hoursDifference === 1 ? '1 hour ago' : `${hoursDifference} hours ago`;
    }
    const daysDifference = Math.round(hoursDifference / 24);
    return daysDifference === 1 ? '1 day ago' : `${daysDifference} days ago`;
  }

  addAnnouncement(){
    this.adminService.addAnnouncement(this.userId, this.importanceSelectedOption, this.description, this.setVisibility(this.visibilitySelectedOption))
    .subscribe({
      next: () => {
        this.presentToast("Announcement sent")
        this.dismiss();
        this.ngOnInit();
      },
      error: (error) => {
        console.error("Error deleting announcements:", error);
      }
    });
  }

  setVisibility(array: string){
    if(array.includes('dispatchers') && !array.includes('medics') && !array.includes('admins')){ // Dispatchers
      return 1;
    }
    if(!array.includes('dispatchers') && array.includes('medics') && !array.includes('admins')){ // Medics
      return 2;
    }
    if(!array.includes('dispatchers') && !array.includes('medics') && array.includes('admins')){ // Admins
      return 3;
    }
    if(!array.includes('dispatchers') && array.includes('medics') && array.includes('admins')){ // Medics & Admins
      return 4;
    }
    if(array.includes('dispatchers') && !array.includes('medics') && array.includes('admins')){ // Dispatchers & Admins
      return 5;
    }
    if(array.includes('dispatchers') && array.includes('medics') && !array.includes('admins')){ // Dispatchers & Medics
      return 6;
    }
    else{
      return 0;
    }
  }
  
  async deleteAlert() {
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
            this.deleteAnnouncement(this.selectedAnnouncement.id);
            this.dismiss();
            this.ngOnInit();
    
          },
        },
      ],
    });
    await alert.present();
  }

  deleteAnnouncement(id:number){
    this.adminService.deleteAnnouncement(id)
    .subscribe({
      next: () => {
        this.presentToast("Announcement deleted")
      },
      error: (error) => {
        console.error("Error deleting announcements:", error);
      }
    });
  }

  async presentToast(message:string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  openModal(announcement: any){
    this.selectedAnnouncement = announcement;
    this.modal?.present();
  }

  send() {
    console.log(this.visibilitySelectedOption);
  }

  dismiss(){
    this.modalController.dismiss();
  }

  back(){
    this.router.navigate(['/admin-panel']);
  }
}
