import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.page.html',
  styleUrls: ['./manage-members.page.scss'],
})
export class ManageMembersPage implements OnInit {

  constructor(private router:Router, private modalContrl:ModalController) { }

  ngOnInit() {
  }

  goBack(){
this.router.navigate(["/folder/Admin Panel"])
  }

  cancel(){
    this.modalContrl.dismiss();
  }

}
