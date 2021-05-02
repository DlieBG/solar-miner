import { TestBed } from '@angular/core/testing';

import { MiningService } from './mining.service';

describe('MiningService', () => {
  let service: MiningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
