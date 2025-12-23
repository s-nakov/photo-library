import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, Injector, OnInit, signal, untracked } from '@angular/core';
import { Photo } from '../../models/photo.model';
import { PhotosApiService } from '../../services/photos-api.service';
import { PhotoGrid } from "../../../../shared/ui/photo-grid/photo-grid";
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PHOTO_CARD_ACTIONS, PhotoCardActions } from '../../../../shared/ui/photo-card/photo-card.actions';
import { FavoritesService } from '../../../favorites/services/favorites.service';
import { ToastService } from '../../../../core/notifications/toast.service';
import { ScrollRestoreDirective } from '../../../../shared/directives/scroll-restore.directive';

@Component({
  selector: 'app-photos',
  imports: [PhotoGrid, EmptyState, InfiniteScrollDirective, ScrollRestoreDirective],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
  providers: [
    {
      provide: PHOTO_CARD_ACTIONS,
      useExisting: Photos,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Photos implements OnInit, PhotoCardActions {
  private injector = inject(Injector);
  private readonly photosApiService = inject(PhotosApiService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  private readonly pageSize = 20;
  readonly page = signal(1);
  private readonly _hasMore = signal(true);

  readonly photos = signal<Photo[]>([]);
  readonly loading = signal(false);
  readonly hasMore = computed(() => this._hasMore());

  ngOnInit(): void {
    this.initializePhotosFetching();
  }

  initializePhotosFetching(): void {
    effect(() => {
      const p = this.page();
      untracked(() => {
        this.loadPage(p);
      });
    }, { injector: this.injector });
  }

  loadMore(): void {
    if (this.loading() || !this.hasMore()) return;
    this.page.update(p => p + 1);
  }

  private loadPage(page: number): void {
    if (this.loading() || !this.hasMore()) return;

    this.loading.set(true);

    this.photosApiService.getPhotos(page, this.pageSize).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        if (items.length === 0) {
          this._hasMore.set(false);
          return;
        }
        this.photos.update(prev => [...prev, ...items]);
      },
      error: () => {
        this.toast.error('Something went wrong...');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  photoClicked(photoId: number): void {
    if (this.favoritesService.isFavorite(photoId)) {
      this.toast.error('Photo is already added to favorites!');
      return;
    }

    this.favoritesService.add(photoId);
    this.toast.success('Photo added to favorites');
  }
}
