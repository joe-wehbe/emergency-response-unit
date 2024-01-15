import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoAnnouncementsPage } from './no-announcements.page';

describe('NoAnnouncementsPage', () => {
  let component: NoAnnouncementsPage;
  let fixture: ComponentFixture<NoAnnouncementsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NoAnnouncementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
