import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-reports',
  templateUrl: './case-reports.page.html',
  styleUrls: ['./case-reports.page.scss'],
})
export class CaseReportsPage implements OnInit {

  selectedSegment: string = 'Ongoing';

  constructor(private router:Router) { }

  ngOnInit() {
  }

  navigateCaseReportForm(){
    this.router.navigate(['/case-report-form'], { queryParams: { from: 'case-reports' } });
  }
}
