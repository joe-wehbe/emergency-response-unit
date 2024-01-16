import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-announcements',
  templateUrl: './add-announcements.page.html',
  styleUrls: ['./add-announcements.page.scss'],
})
export class AddAnnouncementsPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/manage-announcements']);
  }

}
