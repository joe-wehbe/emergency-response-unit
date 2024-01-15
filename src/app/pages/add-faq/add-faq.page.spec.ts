import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFAQPage } from './add-faq.page';

describe('AddFAQPage', () => {
  let component: AddFAQPage;
  let fixture: ComponentFixture<AddFAQPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddFAQPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
