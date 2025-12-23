import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollDirective } from './infinite-scroll.directive';

@Component({
  standalone: true,
  template: `
    <div #root></div>
    <div
      appInfiniteScroll
      [appInfiniteScrollEnabled]="enabled"
      [appInfiniteScrollRoot]="root"
      [appInfiniteScrollRootMargin]="rootMargin"
      [appInfiniteScrollThreshold]="threshold"
      (appInfiniteScroll)="onEmit()"
    ></div>
  `,
  imports: [InfiniteScrollDirective],
})
class InfiniteScrollHostComponent {
  enabled = true;
  emitCount = 0;
  rootMargin = '0px 0px 300px 0px';
  threshold: number | number[] = 0;

  onEmit() {
    this.emitCount += 1;
  }
}

describe('InfiniteScrollDirective', () => {
  let fixture: ComponentFixture<InfiniteScrollHostComponent>;
  let host: InfiniteScrollHostComponent;
  let intersectionCallback: IntersectionObserverCallback | null = null;
  let observedElement: Element | null = null;
  let lastObserver: IntersectionObserver | null = null;
  let lastOptions: IntersectionObserverInit | undefined;

  const originalIntersectionObserver = globalThis.IntersectionObserver;

  class FakeIntersectionObserver {
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      intersectionCallback = callback;
      lastOptions = options;
      lastObserver = this as unknown as IntersectionObserver;
    }

    observe(element: Element) {
      observedElement = element;
    }

    disconnect() { }
  }

  const triggerIntersection = (isIntersecting: boolean) => {
    if (!intersectionCallback || !observedElement || !lastObserver) {
      throw new Error('IntersectionObserver is not initialized.');
    }

    intersectionCallback(
      [
        {
          isIntersecting,
          target: observedElement,
        } as IntersectionObserverEntry,
      ],
      lastObserver
    );
  };

  const createHost = async (options?: {
    enabled?: boolean;
    rootMargin?: string;
    threshold?: number | number[];
  }) => {
    fixture = TestBed.createComponent(InfiniteScrollHostComponent);
    host = fixture.componentInstance;
    if (options?.enabled !== undefined) {
      host.enabled = options.enabled;
    }
    if (options?.rootMargin !== undefined) {
      host.rootMargin = options.rootMargin;
    }
    if (options?.threshold !== undefined) {
      host.threshold = options.threshold;
    }
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    intersectionCallback = null;
    observedElement = null;
    lastObserver = null;
    lastOptions = undefined;
    globalThis.IntersectionObserver = FakeIntersectionObserver as unknown as typeof IntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [InfiniteScrollHostComponent],
    }).compileComponents();
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('should emit when intersecting and enabled', async () => {
    await createHost();

    triggerIntersection(true);

    expect(host.emitCount).toBe(1);
  });

  it('should not emit when disabled', async () => {
    await createHost({ enabled: false });

    triggerIntersection(true);

    expect(host.emitCount).toBe(0);
  });

  it('should guard against rapid re-triggers', async () => {
    await createHost();

    triggerIntersection(true);
    triggerIntersection(true);

    expect(host.emitCount).toBe(1);

    await Promise.resolve();

    triggerIntersection(true);

    expect(host.emitCount).toBe(2);
  });

  it('should pass the configured options to the observer', async () => {
    await createHost({
      rootMargin: '0px 0px 100px 0px',
      threshold: 0.5,
    });

    expect(lastOptions).toBeTruthy();
    expect(lastOptions?.rootMargin).toBe('0px 0px 100px 0px');
    expect(lastOptions?.threshold).toBe(0.5);
  });

  it('should use default options when none are provided', async () => {
    await createHost();

    expect(lastOptions).toBeTruthy();
    expect(lastOptions?.rootMargin).toBe('0px 0px 300px 0px');
    expect(lastOptions?.threshold).toBe(0);
  });
});
