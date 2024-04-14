import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin/admin.service';
import { SharedService } from 'src/app/services/shared.service';
import { HttpClient} from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-schedule',
  templateUrl: './change-schedule.page.html',
  styleUrls: ['./change-schedule.page.scss'],
})

export class ChangeSchedulePage implements OnInit {
  selectedUser: any;
  selectedOption: string = 'monday';
  shifts: any[] = [];
  shiftsPastWeek: number = 0;
  userId: string = '';


  user: any;
  // userId: string = '';
  userShifts: any[] = [];
  // shifts: any[] = [];
  semesterData: any[] = [];

  constructor(
    private toastController:ToastController, 
    private http:HttpClient, 
    private sharedService:SharedService, 
    private adminService:AdminService, 
    private alertController:AlertController, 
    private router:Router, 
    private modalController:ModalController,
    private userService: UserService,
    private route:ActivatedRoute,
  ) { }

  ngOnInit() {  
    this.getUserShifts();
  }
  
  getUserShifts(){
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.userService.getUserShifts(this.userId)
      .subscribe({
        next: (response) => {
          console.log("Fetched user shifts:", response);
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.userShifts = [].concat.apply([], Object.values(parsedResponse['Shifts']));
          this.userShifts.forEach(shiftRecord => {
            this.shifts.push({ id: shiftRecord.id, day: shiftRecord.shift.day, start_time: shiftRecord.shift.time_start, end_time: shiftRecord.shift.time_end})
          });
        },
        error: (error) => {
          console.error("Error getting user shifts:", error);
        },
        complete: () => {
        }
      });
    });
  }

  // getShiftCoverCount(shiftId: number) {
   
  //   return this.adminService.getShiftCovers(shiftId);
  // }
 

  // getDayName(dateString: string): string {
  //   const date = new Date(dateString);
  //   const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  //   const dayOfWeek = date.getDay();
  //   return dayNames[dayOfWeek];
  // }

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
            this.router.navigate(["./user-profile"])
          },
        },
      ],
    });
    await alert.present();
  }

  dismiss(){
    this.modalController.dismiss();
  }

  add(){
  }

  async deleteAlert(shift_id: number) {
    const alert = await this.alertController.create({
      header: 'Delete Shift?',
      subHeader: 'Are you sure you want to permanently delete this shift?',
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
            // this.deleteShift(this.selectedUser, shift_id);
          }
        },
      ],
    });
    await alert.present();
  }

  // async deleteShift(user_id: number, shift_id: number){
  //   try {
  //     await this.http.delete<any>(`http://localhost:8000/api/v0.1/admin/delete-shift/${shift_id}/${user_id}`).pipe(
  //       catchError(async (error) => {
  //         console.error('Error occurred while deleting shift:', error);
  //         const toast = await this.toastController.create({
  //           message: 'Failed to delete shift',
  //           duration: 2000, 
  //           position: 'bottom'
  //         });
  //         toast.present();
  //         throw error;
  //       })
  //     ).toPromise();
  
  //     const toast = await this.toastController.create({
  //       message: 'Shift deleted successfully',
  //       duration: 2000, 
  //       position: 'bottom'
  //     });
  //     toast.present();
    
      
  //   } catch (error) {
  //     console.error('Error occurred while deleting shift:', error);
  //     const toast = await this.toastController.create({
  //       message: 'Failed to delete shift',
  //       duration: 2000, 
  //       position: 'bottom'
  //     });
  //     toast.present();
  //   }
  // }

  async saveAlert() {
    const alert = await this.alertController.create({
      header: 'Save Changes?',
      subHeader: 'Are you sure you want to save the changes you made?',
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
          handler: () =>{
            this.router.navigate(["/user-profile"])
          }
        },
      ],
    });
    await alert.present();
  }

}
