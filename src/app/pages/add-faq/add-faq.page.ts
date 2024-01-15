import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.page.html',
  styleUrls: ['./add-faq.page.scss'],
})
export class AddFAQPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/medical-faq']);
  }
}
