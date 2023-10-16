import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, CanActivateFn, RouterStateSnapshot } from '@angular/router';

import { resourceSelectedGuard } from './resource-selected.guard';

describe('resourceSelectedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => resourceSelectedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {}
            }
          }
        }
      ]
    });
  });

  it('should return true for resource === creature', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.queryParams = { resource: 'creature' };
    expect(executeGuard(route.snapshot, {} as RouterStateSnapshot)).toBeTrue();
  });

  it('should return true for resource === starship', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.queryParams = { resource: 'starship' };
    expect(executeGuard(route.snapshot, {} as RouterStateSnapshot)).toBeTrue();
  });

  it('should return false for resource === undefined', () => {
    const route = TestBed.inject(ActivatedRoute);
    expect(executeGuard(route.snapshot, {} as RouterStateSnapshot)).toBeFalse();
  });

  it('should return false for not valid resource', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.queryParams = { resource: 'bad resource' };
    expect(executeGuard(route.snapshot, {} as RouterStateSnapshot)).toBeFalse();
  });
});
