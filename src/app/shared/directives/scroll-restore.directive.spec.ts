import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import { createRouterMock, RouterMock } from '../../testing/mocks/router.mock';
import { ScrollRestoreDirective } from './scroll-restore.directive';

@Component({
  standalone: true,
  template: `<div class="scroll-host" appScrollRestore></div>`,
  imports: [ScrollRestoreDirective],
})
class ScrollRestoreHostComponent { }

describe('ScrollRestoreDirective', () => {
  let fixture: ComponentFixture<ScrollRestoreHostComponent>;
  let routerMock: RouterMock;
  let hostElement: HTMLElement;

  let rafQueue: FrameRequestCallback[];
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame;

  beforeEach(async () => {
    rafQueue = [];
    globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
      rafQueue.push(callback);
      return 0;
    };

    routerMock = createRouterMock();
    routerMock.setUrl('/favorites');

    await TestBed.configureTestingModule({
      imports: [ScrollRestoreHostComponent],
      providers: [{ provide: Router, useValue: routerMock.service }],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollRestoreHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    hostElement = fixture.debugElement.query((debugEl) =>
      debugEl.nativeElement?.classList?.contains('scroll-host')
    ).nativeElement as HTMLElement;

    Object.defineProperty(hostElement, 'scrollTop', {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
  });

  it('should store scroll position on navigation start', () => {
    hostElement.scrollTop = 160;

    routerMock.events$.next(new NavigationStart(1, '/favorites'));

    hostElement.scrollTop = 10;

    routerMock.events$.next(new NavigationEnd(2, '/favorites', '/favorites'));

    while (rafQueue.length) {
      rafQueue.shift()?.(0);
    }

    expect(hostElement.scrollTop).toBe(160);
  });

  it('should restore scroll position only for the current url', () => {
    hostElement.scrollTop = 200;

    routerMock.events$.next(new NavigationStart(1, '/favorites'));
    routerMock.setUrl('/photos');

    hostElement.scrollTop = 0;

    routerMock.events$.next(new NavigationEnd(2, '/photos', '/photos'));

    while (rafQueue.length) {
      rafQueue.shift()?.(0);
    }

    expect(hostElement.scrollTop).toBe(0);
  });
});
