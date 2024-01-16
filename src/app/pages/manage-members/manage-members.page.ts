import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manage-members',
  templateUrl: './manage-members.page.html',
  styleUrls: ['./manage-members.page.scss'],
})
export class ManageMembersPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goBack(){
this.router.navigate(["/folder/Admin Panel"])
  }
}
