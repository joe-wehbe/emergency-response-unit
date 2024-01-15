import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manage-faq',
  templateUrl: './manage-faq.page.html',
  styleUrls: ['./manage-faq.page.scss'],
})
export class ManageFAQPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['medical-faq']);
  }

}
