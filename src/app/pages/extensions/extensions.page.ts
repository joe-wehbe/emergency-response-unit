import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-extensions',
  templateUrl: './extensions.page.html',
  styleUrls: ['./extensions.page.scss'],
})
export class ExtensionsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild(IonContent, { static: true })
  content!: IonContent;
  scrollTo(letter: string) {
    const element = document.getElementById(letter);
    if (element) {
      this.content.scrollToPoint(0, element.offsetTop, 500);
    }
  }

}
