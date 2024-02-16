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

  //these variables are for the radio buttons
  selectedOption1: string = 'serious';
  otherInput: string = '';

  selectedOption2: string = 'first responder team';
  selectedOption3: string = 'lau clinic';
  selectedOption4: string = 'yes';
  selectedOption5: string = 'yes';


  optionSelected() {
    if (this.selectedOption1 !== 'other' || this.selectedOption2 !== 'other' || this.selectedOption3 !== 'other' || this.selectedOption4 !== 'other') {
      this.otherInput = '';
    }
  }

}
