import { Event as RouterEvent, Router } from '@angular/router';
import { Subject } from 'rxjs';

export interface RouterMock {
  service: Pick<Router, 'navigateByUrl' | 'events' | 'url'>;
  navigateByUrlCalls: string[];
  events$: Subject<RouterEvent>;
  setNavigateByUrlResult: (result: Promise<boolean>) => void;
  setUrl: (url: string) => void;
}

export const createRouterMock = (): RouterMock => {
  const navigateByUrlCalls: string[] = [];
  const events$ = new Subject<RouterEvent>();
  let navigateByUrlResult = Promise.resolve(true);
  let url = '/';

  const service = {
    navigateByUrl: (url: string) => {
      navigateByUrlCalls.push(url);
      return navigateByUrlResult;
    },
    events: events$.asObservable(),
    url
  };

  return {
    service,
    navigateByUrlCalls,
    events$,
    setNavigateByUrlResult: (result) => {
      navigateByUrlResult = result;
    },
    setUrl: (nextUrl) => {
      url = nextUrl;
      service.url = nextUrl;
    }
  };
};
