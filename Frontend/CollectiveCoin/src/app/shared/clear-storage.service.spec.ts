import { TestBed } from '@angular/core/testing';

import { ClearStorageService } from './clear-storage.service';

describe('ClearStorageService', () => {
  let service: ClearStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClearStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
