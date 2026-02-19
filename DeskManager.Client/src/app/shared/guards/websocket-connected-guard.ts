import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { WebsocketService } from '../services/websocket-service';
import { filter } from 'rxjs';

export const websocketConnectedGuard: CanActivateFn = (route, state) => {
  return inject(WebsocketService).connected$.pipe(filter(x => x));
};
