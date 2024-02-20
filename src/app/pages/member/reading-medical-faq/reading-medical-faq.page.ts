import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reading-medical-faq',
  templateUrl: './reading-medical-faq.page.html',
  styleUrls: ['./reading-medical-faq.page.scss'],
})
export class ReadingMedicalFaqPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  back(){
    this.router.navigate(["./medical-faqs"])
  }

}
