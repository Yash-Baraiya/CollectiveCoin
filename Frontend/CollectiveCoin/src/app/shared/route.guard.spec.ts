import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { RouteGuard } from './route.guard';

describe('routeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => routeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
