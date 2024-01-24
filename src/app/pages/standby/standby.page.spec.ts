import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandbyPage } from './standby.page';

describe('StandbyPage', () => {
  let component: StandbyPage;
  let fixture: ComponentFixture<StandbyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StandbyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
