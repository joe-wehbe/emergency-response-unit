import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoRequestsPage } from './no-requests.page';

describe('NoRequestsPage', () => {
  let component: NoRequestsPage;
  let fixture: ComponentFixture<NoRequestsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NoRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
