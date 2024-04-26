import { Component, OnInit, ViewChild } from '@angular/core';
import {Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin/admin.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
})
export class AdminPanelPage implements OnInit {
  user: string = "";
  semesterData: any[] = [];
  fromDate: string = '2024-03-30';
  toDate: String = '2024-03-30';

  constructor(private router:Router, 
    private modalController:ModalController,
    private adminService:AdminService,
    private userService:UserService) {}

  ngOnInit() {
    this.getSemester();
    const name = localStorage.getItem('first_name');

    if (name !== null) {
        this.user = name;
    } else {
        this.user = "";
    }
  }

  getSemester() {
    this.userService.getSemester()
    .subscribe({
      next: (response) => {
      
        this.semesterData = (response as any)['Semester'];

        if(this.semesterData[0]){
          this.fromDate = this.semesterData[0].start_date;
          this.toDate = this.semesterData[0].end_date;
        }
        else{
          console.log("Semester dates not specified");
        }

      },
      error: (error) => {
        console.error("Error getting semester data:", error);
      },
      complete: () => {
      }
    });
  }

  updateSemesterDates(){
    this.adminService.updateSemesterDates(this.fromDate, this.toDate)
    .subscribe({
      next: (response) => {
        console.log("Semester dates updated successfully:", response);
      },
      error: (error) => {
        console.error("Error updating semester dates:", error);
      },
    });
  }

  goToRequests(){
    this.router.navigate(['/signup-requests']);
  }

  goToManageFAQs(){
    this.router.navigate(['/manage-faqs']);
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
    this.updateSemesterDates();
    this.modalController.dismiss();
  }

  dismiss(){
    this.modalController.dismiss();
  }

}
