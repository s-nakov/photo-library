import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../../../core/storage/local-storage.service';

const STORAGE_KEY = 'favorite_photo_ids_v1';

@Injectable({ providedIn: 'root' })
export class FavoritesService {

    private storage = inject(LocalStorageService);

    private readonly ids$ = new BehaviorSubject<Set<number>>(
        new Set(this.storage.get<number[]>(STORAGE_KEY, []))
    );

    favoritesIdsChanges() {
        return this.ids$.asObservable();
    }

    getIdsSnapshot(): Set<number> {
        return new Set(this.ids$.value);
    }

    isFavorite(id: number): boolean {
        return this.ids$.value.has(id);
    }

    add(id: number): void {
        const next = new Set(this.ids$.value);
        next.add(id);
        this.commit(next);
    }

    remove(id: number): void {
        const next = new Set(this.ids$.value);
        next.delete(id);
        this.commit(next);
    }

    toggle(id: number): void {
        this.isFavorite(id) ? this.remove(id) : this.add(id);
    }

    clear(): void {
        this.commit(new Set());
    }

    private commit(next: Set<number>) {
        this.ids$.next(next);
        this.storage.set(STORAGE_KEY, Array.from(next));
    }
}
