import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-manage-faq',
  templateUrl: './manage-faq.page.html',
  styleUrls: ['./manage-faq.page.scss'],
})
export class ManageFAQPage implements OnInit {

  constructor(private router:Router, public alertController: AlertController) { }

  ngOnInit() {
  }

  back(){
    this.router.navigate(['/admin-panel']);
  }

  navigateMedicalFAQ(){
    this.router.navigate(["./medical-faq"])
  }
}
