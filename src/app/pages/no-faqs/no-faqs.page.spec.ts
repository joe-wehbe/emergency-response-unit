import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoFAQsPage } from './no-faqs.page';

describe('NoFAQsPage', () => {
  let component: NoFAQsPage;
  let fixture: ComponentFixture<NoFAQsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NoFAQsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
