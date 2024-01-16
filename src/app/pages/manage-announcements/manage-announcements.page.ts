import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-manage-announcements',
  templateUrl: './manage-announcements.page.html',
  styleUrls: ['./manage-announcements.page.scss'],
})
export class ManageAnnouncementsPage implements OnInit {

  constructor(private router:Router, private modalContrl:ModalController) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/folder/Admin Panel']);
  }
  goToAddAnnouncement(){
    this.router.navigate(['add-announcements']);
  }

  cancel(){
    this.modalContrl.dismiss();
  }
}
