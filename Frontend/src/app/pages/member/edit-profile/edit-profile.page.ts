import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  constructor(private modalController:ModalController, private router:Router) { }

  ngOnInit() {
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

  dismiss(){
    this.modalController.dismiss()
  }

  navigateProfile(){
    this.router.navigate(['./profile'])
  }

}