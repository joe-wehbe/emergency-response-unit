import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingRequestPage } from './pending-request.page';

describe('PendingRequestPage', () => {
  let component: PendingRequestPage;
  let fixture: ComponentFixture<PendingRequestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PendingRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
