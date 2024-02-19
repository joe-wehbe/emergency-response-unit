import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadingMedicalFaqPage } from './reading-medical-faq.page';

describe('ReadingMedicalFaqPage', () => {
  let component: ReadingMedicalFaqPage;
  let fixture: ComponentFixture<ReadingMedicalFaqPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReadingMedicalFaqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
