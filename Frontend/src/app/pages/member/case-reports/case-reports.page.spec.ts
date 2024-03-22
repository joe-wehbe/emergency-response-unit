import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseReportsPage } from './case-reports.page';

describe('CaseReportsPage', () => {
  let component: CaseReportsPage;
  let fixture: ComponentFixture<CaseReportsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CaseReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
