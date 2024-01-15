import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-no-faqs',
  templateUrl: './no-faqs.page.html',
  styleUrls: ['./no-faqs.page.scss'],
})
export class NoFAQsPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/folder/Admin Panel']);
  }

}
