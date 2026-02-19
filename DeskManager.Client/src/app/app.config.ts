import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { provideStore } from '@ngxs/store';
import { routes } from './app.routes';
import { VolumeOutputState } from './features/volume-outputs/state/volume-output.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore([VolumeOutputState], withNgxsReduxDevtoolsPlugin()),
  ],
};
