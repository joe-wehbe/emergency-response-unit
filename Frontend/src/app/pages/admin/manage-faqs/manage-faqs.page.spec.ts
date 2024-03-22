import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageFAQsPage } from './manage-faqs.page';

describe('ManageFAQsPage', () => {
  let component: ManageFAQsPage;
  let fixture: ComponentFixture<ManageFAQsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageFAQsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
