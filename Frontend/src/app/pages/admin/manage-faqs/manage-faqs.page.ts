import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-manage-faqs',
  templateUrl: './manage-faqs.page.html',
  styleUrls: ['./manage-faqs.page.scss'],
})
export class ManageFAQsPage implements OnInit {

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
