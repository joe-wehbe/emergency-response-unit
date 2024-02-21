import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
})
export class AdminPanelPage implements OnInit {


  constructor(private router:Router) {}

  ngOnInit() {
  }

  goToRequests(){
    this.router.navigate(['/login-requests']);
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

}