import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit, OnDestroy {

  darkMode: boolean = false;
  private darkModeToggleSubscription!: Subscription;

  constructor(private appComponent: AppComponent) {}

  ngOnInit() {
    this.checkDarkModeStatus();
    this.darkModeToggleSubscription = this.appComponent.darkModeToggled.subscribe((darkMode: boolean) => {
      this.darkMode = darkMode;
      this.checkDarkModeStatus();
    });
  }

  ngOnDestroy() {
    this.darkModeToggleSubscription.unsubscribe();
  }

  checkDarkModeStatus() {
    const checkIsDarkMode = localStorage.getItem('darkModeActivated');
    this.darkMode = checkIsDarkMode === 'true';
  }
}
