import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
})
export class AdminPanelPage implements OnInit {


  constructor(private router:Router, private modalController:ModalController) {}

  ngOnInit() {
  }

  goToRequests(){
    this.router.navigate(['/signup-requests']);
  }

  goToManageFAQs(){
    this.router.navigate(['/manage-faq']);
  }

  goToManageAnnouncements(){
    this.router.navigate(['/manage-announcements']);
  }

  goToExtensions(){
    this.router.navigate(['/manage-extensions']);
  }

  goToMembers(){
    this.router.navigate(["/manage-members"]);
  }

  goToEmergencyRecords(){
    this.router.navigate(["/emergency-records"]);
  }

  goToAttendanceRecords(){
    this.router.navigate(["/attendance-records"]);
  }

  apply(){
    this.modalController.dismiss();
  }

  dismiss(){
    this.modalController.dismiss();
  }

}
