import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-medical-faqs',
  templateUrl: './medical-faqs.page.html',
  styleUrls: ['./medical-faqs.page.scss'],
})
export class MedicalFaqsPage implements OnInit {
  constructor(private router: Router, private userService: UserService) {}

  navigateReadingFAQ(type: string) {
    this.router.navigate(['./reading-medical-faq', { type: type }]);
  }

  ngOnInit() {}
}
