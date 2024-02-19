import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private router:Router, private alertController: AlertController) { }

  ngOnInit() {}

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
      subHeader: 'Select which rank to promote/demote this member to.',
      cssClass: "alert-dialog",

      inputs: [
        {
          name: 'rank',
          type: 'radio',
          label: 'Board member',
          value: 'board-member',
          checked: true
        },
        {
          name: 'rank',
          type: 'radio',
          label: 'Medic',
          value: 'medic'
        },
        {
          name: 'rank',
          type: 'radio',
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
      subHeader: 'Are you sure you want to permanently remove this member?',
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
