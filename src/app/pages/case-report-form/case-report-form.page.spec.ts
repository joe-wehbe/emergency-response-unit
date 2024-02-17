import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseReportFormPage } from './case-report-form.page';

describe('CaseReportFormPage', () => {
  let component: CaseReportFormPage;
  let fixture: ComponentFixture<CaseReportFormPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CaseReportFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
