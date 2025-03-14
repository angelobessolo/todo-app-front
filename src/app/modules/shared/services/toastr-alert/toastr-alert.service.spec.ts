import { TestBed } from '@angular/core/testing';

import { ToastrAlertService } from './toastr-alert.service';

describe('ToastrAlertService', () => {
  let service: ToastrAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
