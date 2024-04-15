import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  user: any;
  userId: string = localStorage.getItem("user_id") ?? '';
  userShifts: any[] = [];
  shifts: any[] = [];
  semesterData: any[] = [];
  isLoading: boolean = false;

  bio: string = '';
  tags: string = '';

  constructor(
    private router:Router, 
    private alertController: AlertController, 
    private modalController:ModalController,
    private toastController:ToastController,
    private userService:UserService) { }

  ngOnInit() {
    this.getUserInfo()
    this.getUserShifts()
    this.getSemester();
  }

  getUserInfo() {
    this.isLoading = true;
    this.userService.getUserInfo(this.userId)
    .subscribe({
      next: (response) => {
        console.log("Fetched user data:", response);
        this.user = response['User'];
        this.bio = this.user.bio;
        this.tags = this.user.tags;
      },
      error: (error) => {
        console.error("Error getting user info:", error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getUserShifts(){
    this.userService.getUserShifts(this.userId)
    .subscribe({
      next: (response) => {
        console.log("Fetched user shifts:", response);
        const parsedResponse = JSON.parse(JSON.stringify(response));
        this.userShifts = [].concat.apply([], Object.values(parsedResponse['Shifts']));

        this.userShifts.forEach(shiftRecord => {
          this.shifts.push({ day: shiftRecord.shift.day, start_time: shiftRecord.shift.time_start, end_time: shiftRecord.shift.time_end})
        });
      },
      error: (error) => {
        console.error("Error getting user info:", error);
      },
      complete: () => {
      }
    });
  }

  getSemester() {
    this.userService.getSemester()
    .subscribe({
      next: (response) => {
        console.log("Fetched semester data", response);
        this.semesterData = (response as any)['Semester'];
      },
      error: (error) => {
        console.error("Error getting semester data:", error);
      },
      complete: () => {
      }
    });
  }
  
  highlightedDates = (isoString: string) => {
    const date = new Date(isoString);

    if (this.semesterData.length > 0) {
      const startDate = new Date(this.semesterData[0].start_date);
      const endDate = new Date(this.semesterData[0].end_date);

      if (date >= startDate && date <= endDate) {
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const shiftsOnDay = this.shifts.filter(shift => shift.day === dayOfWeek);

        return shiftsOnDay.length > 0 ? {
          textColor: '#800080',
          backgroundColor: '#ffc0cb',
        } : undefined;
      }
    }
    return undefined;
  }

  editBio(){
    this.userService.editBio(this.bio)
    .subscribe({
      next: (response) => {
        console.log("Bio updated successfully: ", response);
      },
      error: (error) => {
        console.error("Error updating bio: ", error);
      },
      complete: () => {
      }
    });
  }

  editTags(){
    this.userService.editTags(this.tags)
    .subscribe({
      next: (response) => {
        console.log("Tags updated successfully: ", response);
      },
      error: (error) => {
        console.error("Error updating tags: ", error);
      },
      complete: () => {
      }
    });
  }

  async navigateProfile(){
    const alert = await this.alertController.create({
      header: 'Save Changes?',
      subHeader: 'Are you sure you want to save changes you made?',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Save',
          cssClass: 'alert-button-ok-green',
          handler: () => {
            if(this.bio != this.user.bio && this.tags == this.user.tags){
              this.editBio();
            }
            else if (this.bio == this.user.bio && this.tags != this.user.tags){
              this.editTags();
            }
            else if (this.bio != this.user.bio && this.tags != this.user.tags){
              this.editBio();
              this.editTags();
            }
            this.presentToast("Changes saved");
            this.router.navigate(["./profile"]).then(() => {
              window.location.reload();
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async back() {
    const alert = await this.alertController.create({
      header: 'Discard Changes?',
      subHeader: 'Are you sure you want to discard any changes you made?',
      cssClass:'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Discard',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            this.router.navigate(["./profile"])
          },
        },
      ],
    });
    await alert.present();
  }

  save(){
    this.modalController.dismiss()
  }

  dismissBio(){
    this.bio = this.user.bio;
    this.modalController.dismiss()
  }

  dismissTags(){
    this.tags = this.user.tags;
    this.modalController.dismiss()
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
