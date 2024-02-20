import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoverRequestsPage } from './cover-requests.page';

describe('CoverRequestsPage', () => {
  let component: CoverRequestsPage;
  let fixture: ComponentFixture<CoverRequestsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CoverRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
