import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseReportPage } from './case-report.page';

describe('CaseReportPage', () => {
  let component: CaseReportPage;
  let fixture: ComponentFixture<CaseReportPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CaseReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
