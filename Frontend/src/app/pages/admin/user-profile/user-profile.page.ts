import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AdminService } from 'src/app/services/admin/admin.service';
import { Time } from '@angular/common';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  selectedUser: any;
  user:any = [];
  user_id: number = 0;
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
  shifts: any[] = [];
  boardMemberChecked: boolean = false;
  medicChecked: boolean = false;
  dispatcherChecked: boolean = false;

  constructor(private toastController:ToastController, private adminService:AdminService, private sharedService:SharedService, private router:Router, private alertController: AlertController) { }

  ngOnInit() {
 this.selectedUser = this.sharedService.getVariableValue();
 this.adminService.get_user_info(this.selectedUser).subscribe(response => {
  this.user = response;
  this.user_id = (this.user['User'].id);
  this.last_name = (this.user['User'].last_name);
  this.first_name = (this.user['User'].first_name);
  this.full_name = this.first_name + ' ' + this.last_name;
  this.user_rank = this.getRole(this.user['User'].user_rank);
  this.lau_email = (this.user['User'].lau_email);
  this.student_id = (this.user['User'].student_id);
  this.major = (this.user['User'].major);
  this.phone_number = (this.user['User'].phone_number);
  this.bio = this.checkBio(this.user['User'].bio);
  if(this.user && this.user['User'] && this.user['User'].tags){
  this.tags.push(...this.user['User'].tags.split(','));
}else{this.tags = ["No", "tags", "yet"];}
this.adminService.get_user_shifts(this.user_id).subscribe(response => {
  const shifts = Object.values(response).reduce((acc: any[], curr: any[]) => acc.concat(curr), []); 
  this.shifts = shifts.map((shift: { date: Date, startTime: Time, endTime: Time }) => ({ 
    date : shift.date,
    start_time: shift.startTime,
    end_time: shift.endTime,
  }));
});
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
          value: 'Board member',
          checked: this.boardMemberChecked, // Bind to component property
          handler: () => { this.boardMemberChecked = !this.boardMemberChecked; }
        },
        {
          name: 'medic',
          type: 'checkbox',
          label: 'Medic',
          value: 'Medic',
          checked: this.medicChecked, // Bind to component property
          handler: () => { this.medicChecked = !this.medicChecked; }
        },
        {
          name: 'dispatcher',
          type: 'checkbox',
          label: 'Dispatcher',
          value: 'Dispatcher',
          checked: this.dispatcherChecked, // Bind to component property
          handler: () => { this.dispatcherChecked = !this.dispatcherChecked; }
        }
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

            this.changeRank(selectedOptions);
          }
        },
      ],
    });

    await alert.present();
  }

  changeRank(ranks: string[]){
    const hasMedic = ranks.includes('Medic');
    const hasDispatcher = ranks.includes('Dispatcher');
    const hasBoardMember = ranks.includes('Board member');
    let rank: number;
    if (hasMedic && hasDispatcher) {
      rank = 6;
    } else if (hasDispatcher && !hasMedic && !hasBoardMember) {
      rank= 1;
    } else if (hasMedic && !hasDispatcher && !hasBoardMember) {
      rank= 2;
    } else if (hasBoardMember && !hasMedic && !hasDispatcher) {
      rank= 3;
    } else if (hasMedic && hasBoardMember && !hasDispatcher) {
      rank= 4;
    } else if (hasDispatcher && hasBoardMember && !hasMedic) {
      rank= 5;
    } else {
      rank= 0;
    }
    this.adminService.change_rank(this.selectedUser, rank).subscribe(response => {
      this.handleResponseAdd(response);
    });

  }

   
  async handleResponseAdd(response: any) {
    const str = JSON.stringify(response);
    const result = JSON.parse(str);
    const status = result['message'];
    if (status == "Rank updated successfully") {
      this.router.navigate(["./manage-members"]);
    } else {
      const toast = await this.toastController.create({
        message: 'Failed to change rank',
        duration: 2000, 
        position: 'bottom'
      });
      toast.present();
    }
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
          handler: () => {
            // Call your API here
            this.removeMember(this.user_id);
          },
        },
      ],
    });
    await alert.present();
  }

  removeMember(id: number){
    this.adminService.remove_member(id).subscribe(response => {
      this.handleResponse(response);
    });

  }

  async handleResponse(response: any) {
    const str = JSON.stringify(response);
    const result = JSON.parse(str);
    console.log(result);
   if (result.message == "User removed successfully") {
    this.router.navigate(["./manage-members"]).then(() => {
      window.location.reload();
    });
    } else {
      const toast = await this.toastController.create({
        message: 'Failed to remove member',
        duration: 2000, 
        position: 'bottom'
      });
      toast.present();
    }
  }
}
