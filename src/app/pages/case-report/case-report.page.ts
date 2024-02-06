import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';

@Component({
  selector: 'app-case-report',
  templateUrl: './case-report.page.html',
  styleUrls: ['./case-report.page.scss'],
})
export class CaseReportPage implements OnInit {
  // public createCaseReportForm: FormGroup;

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
