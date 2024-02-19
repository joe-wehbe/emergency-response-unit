import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalFaqsPage } from './medical-faqs.page';

describe('MedicalFaqsPage', () => {
  let component: MedicalFaqsPage;
  let fixture: ComponentFixture<MedicalFaqsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MedicalFaqsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
