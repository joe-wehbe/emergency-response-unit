import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportEmergencyPage } from './report-emergency.page';

describe('ReportEmergencyPage', () => {
  let component: ReportEmergencyPage;
  let fixture: ComponentFixture<ReportEmergencyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReportEmergencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
