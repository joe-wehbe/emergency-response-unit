import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { FcmService } from 'src/app/services/firebase/fcm.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {

  user: any;
  userShifts: any[] = [];
  shifts: any[] = [];
  semesterData: any[] = [];
  isLoading: boolean = false;
  profilePicture: string = "";

  constructor(
    private router:Router, 
    private alertController: AlertController, 
    private toastController:ToastController,
    private userService:UserService,
    private fcmService:FcmService
  
  ) { }

  ngOnInit() {
    this.getUserInfo()
    this.getUserShifts()
    this.getSemester();
  }

  getUserInfo() {
    this.isLoading = true;
    this.userService.getUserInfo(localStorage.getItem("user_id") ?? '')
    .subscribe({
      next: (response) => {
        this.user = response['User'];
        this.profilePicture = this.user.profile_picture;
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
    this.userService.getUserShifts(localStorage.getItem("user_id") ?? '')
    .subscribe({
      next: (response) => {
        const parsedResponse = JSON.parse(JSON.stringify(response));
        this.userShifts = [].concat.apply([], Object.values(parsedResponse['Shifts']));

        this.userShifts.forEach(shiftRecord => {
          this.shifts.push({ id: shiftRecord.shift_id, day: shiftRecord.shift.day, start_time: shiftRecord.shift.time_start, end_time: shiftRecord.shift.time_end})
          this.shifts.push({ id: shiftRecord.shift_id, day: shiftRecord.shift.day, start_time: shiftRecord.shift.time_start, end_time: shiftRecord.shift.time_end})
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
  
  async showShiftTime(event: any) {
    const selectedDate = event.detail.value;
    const highlighted = this.highlightedDates(selectedDate);
    
    if (highlighted) {
      const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }); 
      const shiftsOnDay = this.shifts.filter(shift => shift.day === dayOfWeek);
  
      if (shiftsOnDay.length > 0) {
        const shiftTimes = shiftsOnDay.map(shift => `from ${shift.start_time} to ${shift.end_time}`).join(', ');
        const alert = await this.alertController.create({
          header: 'Your shifts',
          subHeader: `${shiftTimes}`,
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              cssClass: 'alert-button-cancel'
            },
            {
              text: 'Request cover',
              cssClass: 'alert-button-ok-red',
              handler: () => {
                if (shiftsOnDay.length === 1) {
                  this.reason(shiftsOnDay[0].id, shiftsOnDay[0].start_time, shiftsOnDay[0].end_time, shiftsOnDay[0].day);
                } else {
                  this.multiShiftsAlert(shiftsOnDay);
                }
              },
            },
          ],
          cssClass: 'alert-dialog'
        });
        await alert.present();
      } 
    }
  }
  
  async multiShiftsAlert(shifts: any[]) {
    const alert = await this.alertController.create({
      header: 'Select shift',
      cssClass: 'alert-dialog',
      mode: 'ios',
      inputs: shifts.map((shift, index) => ({
        name: `${index}`,
        type: 'radio',
        label: `from ${shift.start_time} to ${shift.end_time}`,
        value: shift,
        checked: index === 0,
      })),
      
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Select',
          cssClass: 'alert-button-ok-red',
          handler: (selectedShift) => { 
            this.reason(selectedShift.id, selectedShift.start_time, selectedShift.end_time, selectedShift.day);
          },
        },
      ],
    });
    await alert.present();
  }

  async reason(shiftId:any, shiftStartTime: string, shiftEndTime: string, shiftDay: string) {
    const alert = await this.alertController.create({
      header: 'Request cover?',
      subHeader: 'Your attendance will be affected if the member accepting your request fails to cover your shift!',
      cssClass:'alert-dialog',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Reason...',
          cssClass: 'location-input',
          attributes: {
            required: true,
          },
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            return true;
          },
        },
        {
          text: 'Request',
          cssClass: 'alert-button-ok-red',
          handler: async (data) => {
            if (!data.reason) {
              this.presentToast("Please speficy the reason");
              return false;
            } else {
              this.userService.requestCover(shiftId, data.reason)
              .subscribe({
                next: (response) => {
                  console.log("Cover request sent successfully:", response);
                  this.presentToast("Cover request sent")
                  this.fcmService.notifyForCoverRequest(localStorage.getItem("first_name") ?? '', localStorage.getItem("last_name") ?? '', shiftStartTime, shiftEndTime, shiftDay);
                },
                error: (error) => {
                  console.error("Error requesting cover:", error);
                },
              });
              return true;
            }
          },
        },
      ],
    });
    await alert.present();
  } 

  markAttendance(){
    this.userService.markAttendance()
    .subscribe({
      next: (response) => {
        console.log("Marked attendance successfully:", response);
        this.presentToast("Attendance marked for the current shift")
      },
      error: (error) => {
        console.error("Error marking attendance:", error);
      }
    });
  }

  navigateEditProfile(){
    this.router.navigate(["./edit-profile"]);
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