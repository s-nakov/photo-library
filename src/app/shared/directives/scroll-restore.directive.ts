import { DestroyRef, Directive, ElementRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Directive({
    selector: '[appScrollRestore]',
    standalone: true,
})
export class ScrollRestoreDirective implements OnInit {

    private readonly elRef = inject(ElementRef);
    private readonly router = inject(Router);
    private destroyRef = inject(DestroyRef);

    private readonly positions = new Map<string, number>();

    ngOnInit(): void {
        const el = this.elRef.nativeElement;

        // restore when this element is created/attached
        this.router.events
            .pipe(
                filter((e): e is NavigationEnd => e instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                const key = this.key();
                if (this.router.url !== key) return;

                const y = this.positions.get(key) ?? 0;

                // Delay: view might just have been reattached (especially with reuse strategy)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        el.scrollTop = y;
                    });
                });
            });

        // save before leaving route
        this.router.events
            .pipe(
                filter(e => e instanceof NavigationStart),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                const key = this.key();
                this.positions.set(key, el.scrollTop);
            })
    }

    private key(): string {
        return this.router.url;
    }
}