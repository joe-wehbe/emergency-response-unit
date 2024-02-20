import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageFAQPage } from './manage-faq.page';

describe('ManageFAQPage', () => {
  let component: ManageFAQPage;
  let fixture: ComponentFixture<ManageFAQPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageFAQPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
