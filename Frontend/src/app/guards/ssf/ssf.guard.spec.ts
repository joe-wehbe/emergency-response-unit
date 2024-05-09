import { TestBed } from '@angular/core/testing';

import { SsfGuard } from './ssf.guard';

describe('SsfGuard', () => {
  let guard: SsfGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SsfGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
