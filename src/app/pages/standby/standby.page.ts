import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-standby',
  templateUrl: './standby.page.html',
  styleUrls: ['./standby.page.scss'],
})
export class StandbyPage implements OnInit {
  
  selectedSegment: string = 'Ongoing';

    public actionSheetButtons = [
    {
      text: 'Case Report',
      data: {
        action: 'report',
      },
    },
    {
      text: 'Emergency Details',
      data: {
        action: 'details',
      },
    },
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];


  constructor(private router:Router) { }

  ngOnInit() {
  }

  navigateEmergencyDetails(){
    this.router.navigate(["./emergency-details"])
  }

}
