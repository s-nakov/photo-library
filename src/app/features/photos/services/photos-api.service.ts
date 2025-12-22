import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable({ providedIn: 'root' })
export class PhotosApiService {
    // total photos available in our "backend"
    private readonly maxPhotos = 50;

    private readonly width = 200;
    private readonly height = 300;

    /**
     * Emulates a paginated API.
     * page is 1-based (page=1 is first page)
     */
    getPhotos(page: number, limit: number): Observable<Photo[]> {
        const safePage = Math.max(1, Math.floor(page || 1));
        const safeLimit = Math.max(1, Math.floor(limit || 1));

        const startIndex = (safePage - 1) * safeLimit; // 0-based index
        if (startIndex >= this.maxPhotos) return of([]);

        const endIndexExclusive = Math.min(startIndex + safeLimit, this.maxPhotos);

        const photos: Photo[] = [];
        for (let i = startIndex; i < endIndexExclusive; i++) {
            const id = i + 1; // 1..maxPhotos

            photos.push(this.buildPhoto(id) as Photo);
        }

        // small randrom delay to simulate network latency
        return of(photos).pipe(delay(this._getDelay()));
    }

    getPhotoById(id: number): Observable<Photo | null> {
        return of(this.buildPhoto(id)).pipe(delay(this._getDelay()));
    }

    getPhotosByIds(ids: number[]): Observable<Photo[]> {
        const photos = ids
            .map(id => this.buildPhoto(id))
            .filter((p): p is Photo => p !== null);

        return of(photos).pipe(delay(this._getDelay()));
    }

    private buildPhoto(id: number): Photo | null {
        if (id < 1 || id > this.maxPhotos) return null;

        return {
            id,
            url: `https://picsum.photos/id/${id}/${this.width}/${this.height}`,
        };
    }

    private _getDelay(min = 200, max = 300): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
