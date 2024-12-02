import { TestBed } from '@angular/core/testing';

import { UserInfoServicesService } from './user-info.services.service';

describe('UserInfoServicesService', () => {
  let service: UserInfoServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfoServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
