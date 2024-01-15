import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-no-requests',
  templateUrl: './no-requests.page.html',
  styleUrls: ['./no-requests.page.scss'],
})
export class NoRequestsPage implements OnInit {

  constructor( private router:Router) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/folder/Admin Panel']);
  }
}
