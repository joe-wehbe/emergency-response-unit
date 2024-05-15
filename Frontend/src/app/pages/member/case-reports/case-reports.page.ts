import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmergencyService } from 'src/app/services/emergency/emergency.service';

@Component({
  selector: 'app-case-reports',
  templateUrl: './case-reports.page.html',
  styleUrls: ['./case-reports.page.scss'],
})
export class CaseReportsPage implements OnInit {

  selectedSegment: string = 'Ongoing';
  caseReports: any[] = [];
  isLoading: boolean = false;

  constructor(private router:Router, private emergencyService: EmergencyService) { }

  ngOnInit() {
    this.getAllCaseReports();
  }

  getAllCaseReports() {
    this.isLoading = true;
    this.emergencyService.getAllCaseReports().subscribe({
      next: (response) => {
        if (response && response.hasOwnProperty('emergencies')) {
          const parsedResponse = JSON.parse(JSON.stringify(response));
          this.caseReports = [].concat.apply([], Object.values(parsedResponse['emergencies'])
          );
        } else {
          console.log('No case reports to be filled');
        }
      },
      error: (error) => {
        console.error('Error retrieving case reports to be filled:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  navigateCaseReportForm(emergencyId: number){
    this.router.navigate(['/case-report-form', emergencyId], { queryParams: { from: 'case-reports' } });
  }
}
