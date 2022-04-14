import { TestBed } from '@angular/core/testing';

import { TrainingdataService } from './trainingdata.service';

describe('TrainingdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainingdataService = TestBed.get(TrainingdataService);
    expect(service).toBeTruthy();
  });
});
