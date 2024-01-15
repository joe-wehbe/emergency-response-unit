import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAnnouncementsPage } from './add-announcements.page';

describe('AddAnnouncementsPage', () => {
  let component: AddAnnouncementsPage;
  let fixture: ComponentFixture<AddAnnouncementsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddAnnouncementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
