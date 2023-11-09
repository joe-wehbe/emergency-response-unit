import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  isButtonClicked = false;

  constructor() { }

  ngOnInit() {
  }

  sendSOS() {
    this.isButtonClicked = true;
    const sosButton = document.querySelector('.sos-button');
    if (sosButton) {
      sosButton.classList.add('clicked');
      setTimeout(() => {
        sosButton.classList.remove('clicked');
      }, 500); // Reset the animation after 500ms

      // You can add your SOS functionality here
      // For example, send a request to a service or display an SOS message
    }
  }
}
