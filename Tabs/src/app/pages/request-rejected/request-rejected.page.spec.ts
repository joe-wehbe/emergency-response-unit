import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestRejectedPage } from './request-rejected.page';

describe('RequestRejectedPage', () => {
  let component: RequestRejectedPage;
  let fixture: ComponentFixture<RequestRejectedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RequestRejectedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
