import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-standby',
  templateUrl: './standby.page.html',
  styleUrls: ['./standby.page.scss'],
})
export class StandbyPage implements OnInit {

  constructor() { }

  buttonClicked() {
    console.log('Button clicked!');
    // You can add your custom logic here
  }

  ngOnInit() {
  }

}
