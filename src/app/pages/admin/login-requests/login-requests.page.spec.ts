import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginRequestsPage } from './login-requests.page';

describe('LoginRequestsPage', () => {
  let component: LoginRequestsPage;
  let fixture: ComponentFixture<LoginRequestsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
