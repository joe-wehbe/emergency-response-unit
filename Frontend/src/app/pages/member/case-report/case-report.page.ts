import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-report',
  templateUrl: './case-report.page.html',
  styleUrls: ['./case-report.page.scss'],
})
export class CaseReportPage implements OnInit {

  selectedSegment: string = 'Ongoing';

  constructor(private router:Router) { }

  ngOnInit() {
  }

  navigateCaseReportForm(){
    this.router.navigate(['/case-report-form'], { queryParams: { from: 'case-report' } });
  }
}
