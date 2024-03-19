import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupRequestsPage } from './signup-requests.page';

describe('SignupRequestsPage', () => {
  let component: SignupRequestsPage;
  let fixture: ComponentFixture<SignupRequestsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SignupRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
