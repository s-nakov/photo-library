import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { PhotosApiService } from '../../../photos/services/photos-api.service';
import { Photo } from '../../../photos/models/photo.model';
import { of, switchMap, tap } from 'rxjs';
import { PhotoGrid } from "../../../../shared/ui/photo-grid/photo-grid";
import { EmptyState } from "../../../../shared/ui/empty-state/empty-state";
import { PHOTO_CARD_ACTIONS, PhotoCardActions } from '../../../../shared/ui/photo-card/photo-card.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [PhotoGrid, EmptyState],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
  providers: [
    {
      provide: PHOTO_CARD_ACTIONS,
      useExisting: Favorites,
    },
  ],
})
export class Favorites implements OnInit, PhotoCardActions {
  private readonly favoritesService = inject(FavoritesService);
  private readonly photosApiService = inject(PhotosApiService);
  private readonly router = inject(Router);

  readonly favorites = signal<Photo[]>([]);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    if (this.loading()) return;

    this.loading.set(true);

    of(Array.from(this.favoritesService.getIdsSnapshot())).pipe(
      switchMap(ids => this.photosApiService.getPhotosByIds(ids))).subscribe({
        next: (items) => {
          this.favorites.update(prev => [...prev, ...items]);
        },
        error: () => {

        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  readonly isEmpty = computed(() => this.favorites().length === 0 && !this.loading());

  photoClicked(photoId: number): void {
    if (!this.favoritesService.isFavorite(photoId)) return;

    this.router.navigateByUrl(`/photos/${photoId}`);
  }
}
