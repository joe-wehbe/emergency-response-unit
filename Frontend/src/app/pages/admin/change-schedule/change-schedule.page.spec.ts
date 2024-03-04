import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeSchedulePage } from './change-schedule.page';

describe('ChangeSchedulePage', () => {
  let component: ChangeSchedulePage;
  let fixture: ComponentFixture<ChangeSchedulePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChangeSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
