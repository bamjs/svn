import { TestBed } from '@angular/core/testing';

import { InvitationService } from './invitation.service';

describe('InviteService', () => {
  let service: InvitationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvitationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
