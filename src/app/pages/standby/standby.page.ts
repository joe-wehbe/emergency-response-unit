import { Component, OnInit } from '@angular/core';

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
      text: 'Vitals History',
      data: {
        action: 'vitals',
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


  constructor() { }

  ngOnInit() {
  }

}
