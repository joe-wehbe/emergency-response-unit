import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin/admin.service';
import { forkJoin } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-schedule',
  templateUrl: './change-schedule.page.html',
  styleUrls: ['./change-schedule.page.scss'],
})
export class ChangeSchedulePage implements OnInit {

  userId: string = '';
  groupedShifts: { [key: string]: any[] } = {};

  // selectedUser: any;
  selectedOption: string = 'monday';
  shifts: any[] = [];
  shiftsPastWeek: number = 0;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private adminService: AdminService,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getUserShifts();
  }

  getUserShifts() {
    this.isLoading = true;
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.userService.getUserShifts(this.userId).subscribe((response) => {
        this.shifts = Object.values(response).reduce((acc: any[], curr: any[]) => acc.concat(curr), []);
  
        this.groupedShifts = this.groupShiftsByDay(this.shifts);
  
        const requests = this.shifts.map((shift) => this.getShiftCoversCount(shift.id));
        forkJoin(requests).subscribe((responses) => {
          responses.forEach((coverCount, index) => {
            this.shifts[index].coverCount = coverCount;
          });
        }, error => {
          console.error("Error fetching shift covers count:", error);
        }, () => {
          this.isLoading = false;
        });
      }, error => {
        console.error("Error fetching user shifts:", error);
      });
    });
  }

  getShiftCoversCount(shiftId: number) {
    return this.adminService.getShiftCoversCount(this.userId, shiftId);
  }
  
  groupShiftsByDay(shifts: any[]) {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return shifts.reduce((acc, shift) => {
      const day = shift.shift.day;
      if (!acc[day]) {
        acc[day] = [];
      }
      shift.shift.time_start = new Date(`1970-01-01T${shift.shift.time_start}`);
      shift.shift.time_end = new Date(`1970-01-01T${shift.shift.time_end}`);
      acc[day].push(shift);
      return acc;
    }, {});
  }

  sortedDays(): string[] {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return Object.keys(this.groupedShifts).sort((a, b) => {
      return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });
  }

  
  addShift() {
    // this.adminService.addShift()
    // .subscribe({
    //   next: (response) => {
    //     console.log('Logged out successfully:', response);
    //     localStorage.clear();
    //     this.router.navigate(['./login']);
    //   },
    //   error: (error) => {
    //     console.error('Error logging out:', error);
    //   },
    // });
  }

  async deleteAlert(shiftId: number) {
    const alert = await this.alertController.create({
      header: 'Delete Shift?',
      subHeader: 'Are you sure you want to permanently delete this shift?',
      cssClass: 'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Delete',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            this.deleteShift(shiftId);
          },
        },
      ],
    });
    await alert.present();
  }

  deleteShift(shiftId:number){
    this.adminService.deleteShift(this.userId, shiftId)
    .subscribe({
      next: (response) => {
        this.presentToast("Shift deleted");
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error deleting shift:', error);
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
  
  dismiss() {
    this.modalController.dismiss();
  }

  async back() {
    this.router.navigate(['./user-profile', this.userId]);
  }
}