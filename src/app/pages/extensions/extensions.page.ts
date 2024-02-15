import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-extensions',
  templateUrl: './extensions.page.html',
  styleUrls: ['./extensions.page.scss'],
})
export class ExtensionsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild('listContainer') listContainer!: ElementRef;
  scrollTo(letter: string): void {
    const element = this.listContainer.nativeElement.querySelector(`#${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
