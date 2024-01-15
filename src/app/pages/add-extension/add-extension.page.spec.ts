import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddExtensionPage } from './add-extension.page';

describe('AddExtensionPage', () => {
  let component: AddExtensionPage;
  let fixture: ComponentFixture<AddExtensionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddExtensionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
