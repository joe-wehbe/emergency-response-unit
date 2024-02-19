import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageMembersPage } from './manage-members.page';

describe('ManageMembersPage', () => {
  let component: ManageMembersPage;
  let fixture: ComponentFixture<ManageMembersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
