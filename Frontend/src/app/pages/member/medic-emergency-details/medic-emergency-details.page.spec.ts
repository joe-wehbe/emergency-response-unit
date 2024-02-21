import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicEmergencyDetailsPage } from './medic-emergency-details.page';

describe('MedicEmergencyDetailsPage', () => {
  let component: MedicEmergencyDetailsPage;
  let fixture: ComponentFixture<MedicEmergencyDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MedicEmergencyDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
