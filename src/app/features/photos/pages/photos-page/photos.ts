import { Component, computed, effect, inject, Injector, OnInit, signal, untracked } from '@angular/core';
import { Photo } from '../../models/photo.model';
import { PhotosApiService } from '../../services/photos-api.service';
import { PhotoGrid } from "../../../../shared/ui/photo-grid/photo-grid";
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll.directive';

@Component({
  selector: 'app-photos',
  imports: [PhotoGrid, EmptyState, InfiniteScrollDirective],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class Photos implements OnInit {
  private injector = inject(Injector);
  private readonly photosApi = inject(PhotosApiService);

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

  async loadMore(): Promise<void> {
    if (this.loading() || !this.hasMore()) return;
    this.page.update(p => p + 1);
  }

  private async loadPage(page: number): Promise<void> {
    if (this.loading() || !this.hasMore()) return;

    this.loading.set(true);

    this.photosApi.getPhotos(page, this.pageSize).subscribe({
      next: (items) => {
        if (items.length === 0) {
          this._hasMore.set(false);
          return;
        }
        this.photos.update(prev => [...prev, ...items]);
      },
      error: () => {

      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
