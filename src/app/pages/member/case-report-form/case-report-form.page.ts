import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-report-form',
  templateUrl: './case-report-form.page.html',
  styleUrls: ['./case-report-form.page.scss'],
})
export class CaseReportFormPage implements OnInit {

  constructor(private router:Router) { }

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

   back(){
    this.router.navigate(["./case-report"])
  }
}
