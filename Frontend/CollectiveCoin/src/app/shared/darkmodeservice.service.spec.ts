import { TestBed } from '@angular/core/testing';

import { DarkmodeserviceService } from './darkmodeservice.service';

describe('DarkmodeserviceService', () => {
  let service: DarkmodeserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DarkmodeserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
