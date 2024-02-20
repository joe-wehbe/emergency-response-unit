import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnScenePage } from './on-scene.page';

describe('OnScenePage', () => {
  let component: OnScenePage;
  let fixture: ComponentFixture<OnScenePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OnScenePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
