/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { LoteService } from './Lote.service';

describe('Service: Lote', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoteService]
    });
  });

  it('should ...', inject([LoteService], (service: LoteService) => {
    expect(service).toBeTruthy();
  }));
});
