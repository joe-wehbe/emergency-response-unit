import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-case-report',
  templateUrl: './case-report.page.html',
  styleUrls: ['./case-report.page.scss'],
})
export class CaseReportPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  selectedOption: string = 'serious';
  otherInput: string = '';

  optionSelected() {
    if (this.selectedOption !== 'other') {
      this.otherInput = '';
    }
  }

}
