import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AdminService } from 'src/app/services/admin/admin.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  selectedUser: any;
  user:any = [];
  first_name:string = '';
  last_name:string = '';
  full_name:string = '';
  user_rank:string = '';
  lau_email:string = '';
  student_id:string = '';
  major:string = '';
  phone_number:string = '';
  bio:string = '';
  tags: string[] = [];
  profile_pic = '';

  constructor(private adminService:AdminService, private sharedService:SharedService, private router:Router, private alertController: AlertController) { }

  ngOnInit() {
 this.selectedUser = this.sharedService.getVariableValue();
 this.adminService.get_user_info(this.selectedUser).subscribe(response => {
  this.user = response;
  this.last_name = (this.user['User'].last_name);
  this.first_name = (this.user['User'].first_name);
  this.full_name = this.first_name + ' ' + this.last_name;
  this.user_rank = this.getRole(this.user['User'].user_rank);
  this.lau_email = (this.user['User'].lau_email);
  this.student_id = (this.user['User'].student_id);
  this.major = (this.user['User'].major);
  this.phone_number = (this.user['User'].phone_number);
  this.bio = this.checkBio(this.user['User'].bio);
  this.tags.push(...this.user['User'].tags.split(','));
});
 
  }

  checkBio(bio: string): string {
    if (!bio || bio.trim() === '') {
        return 'No bio yet!';
    } else {
        return bio;
    }
}
  getRole(roleNumber: number | string): string {
    switch (Number(roleNumber)) {
      case 1: 
        return 'Dispatcher';
      case 2:
        return 'Medic';
      case 3:
        return 'Admin';
      case 4:
        return 'Medic & Admin';
      case 5: 
      return 'Dispatcher & Admin';
      case 6:
        return 'Dispatcher & Medic';
       
      default:
        return 'Unknown';
    }
  }

  back(){
    this.router.navigate(["./manage-members"])
  }

  shifts = [
    { date: '2024-02-13T08:00:00', startTime: '08:00 AM', endTime: '12:00 PM' },
    { date: '2024-02-13T15:30:00', startTime: '03:30 PM', endTime: '07:00 PM' },
    { date: '2024-02-14T15:30:00', startTime: '03:30 PM', endTime: '07:00 PM' },
  ];

  highlightedDates = (isoString: any) => {
    const date = new Date(isoString).toISOString().split('T')[0];
    const shiftsOnDay = this.shifts.filter(shift => {
      const shiftDate = new Date(shift.date).toISOString().split('T')[0];
      return shiftDate === date;
    });

    return shiftsOnDay.length > 0 ? {
      textColor: '#800080',
      backgroundColor: '#ffc0cb',
    } : undefined;
  };

  async showShiftTime(event: any) {
    const selectedDate = event.detail.value;
    
    const highlighted = this.highlightedDates(selectedDate);
    
    if (highlighted) {
      const selectedDateISO = new Date(selectedDate).toISOString().split('T')[0];
      const shiftsOnDay = this.shifts.filter(shift => {
        const shiftDate = new Date(shift.date).toISOString().split('T')[0];
        return shiftDate === selectedDateISO;
      });

      if (shiftsOnDay.length > 0) {
        const shiftTimes = shiftsOnDay.map(shift => `from ${shift.startTime} to ${shift.endTime}`).join(', ');
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
          cssClass:'alert-dialog'
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
        this.router.navigate(["./change-schedule"])
      },
    },
    {
      text: 'Change rank',
      data: {
        action: 'change-rank',
      },
      handler: () => {
        this.rankAlert()
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
        this.removeAlert()
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
      cssClass: "alert-dialog",
      mode: 'ios',
      inputs: [
        {
          name: 'boardMember',
          type: 'checkbox',
          label: 'Board member',
          value: 'board-member',
          checked: true
        },
        {
          name: 'medic',
          type: 'checkbox',
          label: 'Medic',
          value: 'medic'
        },
        {
          name: 'dispatcher',
          type: 'checkbox',
          label: 'Dispatcher',
          value: 'dispatcher'
        }
      ],
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
          text: 'Change',
          cssClass: 'alert-button-ok-red',
        },
      ],
    });
    await alert.present();
  }
  

  async removeAlert() {
    const alert = await this.alertController.create({
      header: 'Remove member',
      subHeader: 'Are you sure you want to permanently remove this member from the unit?',
      cssClass: "alert-dialog",

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
        },
      ],
    });
    await alert.present();
  }
}
