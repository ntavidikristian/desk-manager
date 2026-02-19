import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { websocketConnectedGuard } from './websocket-connected-guard';

describe('websocketConnectedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => websocketConnectedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
