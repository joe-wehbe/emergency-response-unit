import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}

  navigateReportEmergency(){
    this.router.navigate(["./tabs/report-emergency"])
  }

  navigateProfile(){
    this.router.navigate(["./profile"])
  }

  navigateCommunity(){
    this.router.navigate(["./community"])
  }

  navigateAnnouncement(){
    this.router.navigate(["./announcement"])
  }

  navigateExtensions(){
    this.router.navigate(["./extensions"])
  }

  navigateMedicalFAQs(){
    this.router.navigate(["./medical-faqs"])
  }
}
