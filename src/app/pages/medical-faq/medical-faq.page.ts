import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medical-faq',
  templateUrl: './medical-faq.page.html',
  styleUrls: ['./medical-faq.page.scss'],
})
export class MedicalFAQPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }


    goBack(){
      this.router.navigate(['/folder/Admin Panel']);
    }

    goToAddFAQ(){
      this.router.navigate(['/add-faq']);
    }
  
}
