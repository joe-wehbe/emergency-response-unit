import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-no-announcements',
  templateUrl: './no-announcements.page.html',
  styleUrls: ['./no-announcements.page.scss'],
})
export class NoAnnouncementsPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/folder/Admin Panel']);
  }

  goToAddAnnouncement(){
    this.router.navigate(['add-announcements']);
  }
  

}
