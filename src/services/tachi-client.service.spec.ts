import { TestBed } from '@angular/core/testing';

import { TachiClientService } from './tachi-client.service';

describe('TachiClientService', () => {
  let service: TachiClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TachiClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
