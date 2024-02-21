import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageExtensionsPage } from './manage-extensions.page';

describe('ManageExtensionsPage', () => {
  let component: ManageExtensionsPage;
  let fixture: ComponentFixture<ManageExtensionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageExtensionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
