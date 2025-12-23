import {
    ActivatedRouteSnapshot,
    DetachedRouteHandle,
    RouteReuseStrategy
} from '@angular/router';

export class TabReuseStrategy implements RouteReuseStrategy {
    private stored = new Map<string, DetachedRouteHandle>();

    // only reuse routes marked in route data
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return !!route.routeConfig && route.data?.['reuse'] === true;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        this.stored.set(this.key(route), handle);
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return this.stored.has(this.key(route));
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return this.stored.get(this.key(route)) ?? null;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    private key(route: ActivatedRouteSnapshot): string {
        return route.routeConfig?.path ?? '';
    }
}
