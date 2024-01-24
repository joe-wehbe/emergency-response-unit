import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-standby',
  templateUrl: './standby.page.html',
  styleUrls: ['./standby.page.scss'],
})
export class StandbyPage implements OnInit {
  
  selectedSegment: string = 'Ongoing';

  constructor() { }

  ngOnInit() {
  }

}
