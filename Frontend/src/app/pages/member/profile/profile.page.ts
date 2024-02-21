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
          header: 'Your shifts',
          subHeader: `${shiftTimes}`,
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              cssClass: 'alert-button-cancel'
            },
            {
              text: 'request cover',
              cssClass: 'alert-button-ok-red',
              handler: () => {
                if(shiftsOnDay.length === 1){
                  this.oneShiftAlert();
                }else{
                  this.multiShiftsAlert(shiftsOnDay);
                }

              },
            },
          ],
          cssClass:'alert-dialog'
        });
        await alert.present();
      } 
    }
  }

  async oneShiftAlert() {
    const alert = await this.alertController.create({
      header: 'Request cover?',
      subHeader: 'Your attendance will be affected if the member accepting your request fails to cover your shift!',
      cssClass:'alert-dialog',
      inputs: [
        {
          name: 'Reason',
          type: 'text',
          placeholder: 'Reason...',
          cssClass: 'location-input',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Request',
          cssClass: 'alert-button-ok-red',
        },
      ],
    });
    await alert.present();
  }

  async multiShiftsAlert(shifts: any[]) {
    const alert = await this.alertController.create({
      header: 'Select shift',
      cssClass: 'alert-dialog',
      inputs: shifts.map((shift, index) => ({
        name: `shift-${index}`,
        type: 'radio',
        label: `from ${shift.startTime} to ${shift.endTime}`,
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
          handler: () => {
            this.reason();
          },

        },
      ],
    });
    await alert.present();
  }

  async reason() {
    const alert = await this.alertController.create({
      header: 'Request cover?',
      subHeader: 'Your attendance will be affected if the member accepting your request fails to cover your shift!',
      cssClass:'alert-dialog',
      inputs: [
        {
          name: 'Reason',
          type: 'text',
          placeholder: 'Reason...',
          cssClass: 'location-input',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Request',
          cssClass: 'alert-button-ok-red',
          handler: () => {
          },
        },
      ],
    });
    await alert.present();
  } 

  navigateEditProfile(){
    this.router.navigate(["./edit-profile"]);
  }
}