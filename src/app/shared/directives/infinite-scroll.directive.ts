import {
    DestroyRef,
    Directive,
    ElementRef,
    inject,
    input,
    NgZone,
    OnInit,
    output,
} from '@angular/core';

@Directive({
    selector: '[appInfiniteScroll]',
    standalone: true,
})
export class InfiniteScrollDirective implements OnInit {
    private destroyRef = inject(DestroyRef);

    readonly appInfiniteScrollEnabled = input<boolean>(true);

    /**
        * Root element used for intersection calculations.
        * - null means viewport
        * - pass an element if you have a scroll container
    */
    readonly appInfiniteScrollRoot = input<HTMLElement | null>(null);

    /**
     * Margin around root. Using a positive bottom margin triggers earlier.
     * Example: '0px 0px 400px 0px'
     */
    readonly appInfiniteScrollRootMargin = input<string>('0px 0px 300px 0px');

    /**
     * Intersection threshold (0..1). 0 means "any intersection".
     */
    readonly appInfiniteScrollThreshold = input<number | number[]>(0);

    /**
     * Emits when sentinel is visible and enabled.
     */
    appInfiniteScroll = output<void>();

    private observer?: IntersectionObserver;
    private isEmitting = false; // guard against rapid re-triggers

    constructor(
        private readonly el: ElementRef<HTMLElement>,
        private readonly zone: NgZone
    ) { }

    ngOnInit(): void {
        // Create observer outside Angular for perf; re-enter only when emitting.
        this.zone.runOutsideAngular(() => {
            this.observer = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    if (!entry?.isIntersecting) return;
                    if (!this.appInfiniteScrollEnabled()) return;
                    if (this.isEmitting) return;

                    this.isEmitting = true;

                    this.zone.run(() => this.appInfiniteScroll.emit());

                    // Allow next emit on next microtask/frame
                    queueMicrotask(() => (this.isEmitting = false));
                },
                {
                    root: this.appInfiniteScrollRoot(),
                    rootMargin: this.appInfiniteScrollRootMargin(),
                    threshold: this.appInfiniteScrollThreshold(),
                }
            );

            this.observer.observe(this.el.nativeElement);

            this.destroyRef.onDestroy(() => {
                this.observer?.disconnect();
            });
        });
    }
}
