import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmergencyRecordsPage } from './emergency-records.page';

describe('EmergencyRecordsPage', () => {
  let component: EmergencyRecordsPage;
  let fixture: ComponentFixture<EmergencyRecordsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmergencyRecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
