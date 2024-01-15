import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalFAQPage } from './medical-faq.page';

describe('MedicalFAQPage', () => {
  let component: MedicalFAQPage;
  let fixture: ComponentFixture<MedicalFAQPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MedicalFAQPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
