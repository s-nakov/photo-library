import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, RouteReuseStrategy, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TabReuseStrategy } from './core/routing/tab-reuse.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(MatSnackBarModule),
    { provide: RouteReuseStrategy, useClass: TabReuseStrategy }
  ]
};
