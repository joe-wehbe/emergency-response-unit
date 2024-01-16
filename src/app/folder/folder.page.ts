import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor(private router:Router) {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  goToRequests(){
    this.router.navigate(['/login-requests']);
  }

  goToManageFAQs(){
    this.router.navigate(['/medical-faq']);
  }

  goToManageAnnouncements(){
    this.router.navigate(['/manage-announcements']);
  }

  goToExtensions(){
    this.router.navigate(['/manage-extensions']);
  }

  goToMembers(){
    this.router.navigate(["/manage-members"]);
  }
}
