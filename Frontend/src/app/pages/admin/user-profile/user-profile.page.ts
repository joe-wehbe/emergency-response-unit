import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  boardMemberChecked: boolean = false;
  medicChecked: boolean = false;
  dispatcherChecked: boolean = false;

  user: any;
  userId: string = '';
  userShifts: any[] = [];
  shifts: any[] = [];
  semesterData: any[] = [];
  isLoading: boolean = false;

  constructor(
    private toastController: ToastController,
    private adminService: AdminService,
    private router: Router,
    private alertController: AlertController,
    private userService: UserService,
    private route:ActivatedRoute
  ) {}

  ngOnInit() {
    this.getUserInfo();
    this.getUserShifts();
    this.getSemester();
  }

  getUserInfo(){
    this.isLoading = true;
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.userService.getUserInfo(this.userId)
      .subscribe({
        next: (response) => {
        
          this.user = response['User'];
        },
        error: (error) => {
          console.error("Error getting user info:", error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    });
  }

  getUserShifts(){
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.userService.getUserShifts(this.userId)
      .subscribe({
        next: (response) => {
        
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.userShifts = [].concat.apply([], Object.values(parsedResponse['Shifts']));
  
          this.userShifts.forEach(shiftRecord => {
            this.shifts.push({ id: shiftRecord.id, day: shiftRecord.shift.day, start_time: shiftRecord.shift.time_start, end_time: shiftRecord.shift.time_end})
          });
        },
        error: (error) => {
          console.error("Error getting user info:", error);
        },
        complete: () => {
        }
      });
    });
  }

  getSemester() {
    this.userService.getSemester()
    .subscribe({
      next: (response) => {
       
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
          header: 'Shifts',
          subHeader: `${shiftTimes}`,
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              cssClass: 'alert-button-cancel'
            },
          ],
          cssClass: 'alert-dialog'
        });
        await alert.present();
      } 
    }
  }

  public actionSheetButtons = [
    {
      text: 'Change schedule',
      data: {
        action: 'change-schedule',
      },
      handler: () => {
        this.router.navigate(['./change-schedule', this.userId]);
      },
    },
    {
      text: 'Change rank',
      data: {
        action: 'change-rank',
      },
      handler: () => {
        this.rankAlert();
      },
    },
    {
      text: 'Remove Member',
      role: 'destructive',
      cssClass: 'delete-button',
      data: {
        action: 'delete',
      },
      handler: () => {
        this.removeAlert();
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  async rankAlert() {
    const alert = await this.alertController.create({
      header: 'Change rank',
      subHeader: 'Select which rank(s) to promote/demote this member to.',
      cssClass: 'alert-dialog',
      mode: 'ios',
      inputs: [
        {
          name: 'boardMember',
          type: 'checkbox',
          label: 'Board member',
          value: 'Board member',
          checked: this.boardMemberChecked,
          handler: () => {
            this.boardMemberChecked = !this.boardMemberChecked;
          },
        },
        {
          name: 'medic',
          type: 'checkbox',
          label: 'Medic',
          value: 'Medic',
          checked: this.medicChecked,
          handler: () => {
            this.medicChecked = !this.medicChecked;
          },
        },
        {
          name: 'dispatcher',
          type: 'checkbox',
          label: 'Dispatcher',
          value: 'Dispatcher',
          checked: this.dispatcherChecked,
          handler: () => {
            this.dispatcherChecked = !this.dispatcherChecked;
          },
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Change',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            const selectedOptions: string[] = [];

            if (this.boardMemberChecked) {
              selectedOptions.push('Board member');
            }
            if (this.medicChecked) {
              selectedOptions.push('Medic');
            }
            if (this.dispatcherChecked) {
              selectedOptions.push('Dispatcher');
            }
            this.setRank(selectedOptions);
          },
        },
      ],
    });
    await alert.present();
  }

  setRank(ranks: string[]) {
    const isMedic = ranks.includes('Medic');
    const isDispatcher = ranks.includes('Dispatcher');
    const isBoardMember = ranks.includes('Board member');
  
    if (isDispatcher && !isMedic && !isBoardMember) { // Dispatcher
      this.changeRank(1);
    }
    if (!isDispatcher && isMedic && !isBoardMember) { // Medic
      this.changeRank(2);
    }
    if (!isDispatcher && !isMedic && isBoardMember) { // Admin
      this.changeRank(3);
    }
    if (!isDispatcher && isMedic && isBoardMember) { // Medic & Admin
      this.changeRank(4);
    }
    if (isDispatcher && !isMedic && isBoardMember) { // Dispatcher & Admin
      this.changeRank(5);
    }
    if (isDispatcher && isMedic && !isBoardMember) { // Dispatcher & Medic
      this.changeRank(6);
    }
    if(isDispatcher && isMedic && isBoardMember){ // All selected
      this.presentToast("A member can have at most 2 ranks");
    }
  }

  changeRank(rank: number){
    this.adminService.changeRank(this.userId, rank)
    .subscribe({
      next: (response) => {
       
        this.presentToast(this.user.first_name + ' ' + this.user.last_name + "'s rank is updated");
        this.getUserInfo();
      },
      error: (error) => {
        console.error('Error updating rank:', error);
        this.presentToast("An error occured");
      },
    });
  }

  async removeAlert() {
    const alert = await this.alertController.create({
      header: 'Remove member',
      subHeader: 'Are you sure you want to permanently remove this member from the unit?',
      cssClass: 'alert-dialog',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('Cancelled');
          },
        },
        {
          text: 'Remove',
          cssClass: 'alert-button-ok-red',
          handler: () => {
            this.removeMember(this.userId);
          },
        },
      ],
    });
    await alert.present();
  }

  removeMember(id: string) {
    this.adminService.removeMember(id)
    .subscribe({
      next: (response) => {
       
        this.presentToast(this.user.first_name + ' ' + this.user.last_name + " is no longer in the unit.");
        this.router.navigate(['./manage-members']).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        console.error('Error removing user:', error);
      },
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

  back() {
    this.router.navigate(['./manage-members']);
  }
}
