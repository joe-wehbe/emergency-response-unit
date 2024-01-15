import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login-requests',
  templateUrl: './login-requests.page.html',
  styleUrls: ['./login-requests.page.scss'],
})
export class LoginRequestsPage implements OnInit {

  constructor( private router:Router) { }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/folder/Admin Panel']);
  }
}
