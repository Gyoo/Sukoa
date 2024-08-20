import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { chartResolver } from './chart.resolver';

describe('chartResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => chartResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
