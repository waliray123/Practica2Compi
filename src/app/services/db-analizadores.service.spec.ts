import { TestBed } from '@angular/core/testing';

import { DbAnalizadoresService } from './db-analizadores.service';

describe('DbAnalizadoresService', () => {
  let service: DbAnalizadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbAnalizadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
