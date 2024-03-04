import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendanceRecordsPage } from './attendance-records.page';

describe('AttendanceRecordsPage', () => {
  let component: AttendanceRecordsPage;
  let fixture: ComponentFixture<AttendanceRecordsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AttendanceRecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
