import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medical-faqs',
  templateUrl: './medical-faqs.page.html',
  styleUrls: ['./medical-faqs.page.scss'],
})
export class MedicalFaqsPage implements OnInit {

  constructor(private router:Router) {}

  navigateReadingFAQ(){
    this.router.navigate(["./reading-medical-faq"])
  }

  ngOnInit() {
  }

}
