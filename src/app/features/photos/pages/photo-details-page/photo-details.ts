import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { Photo } from '../../models/photo.model';
import { PhotosApiService } from '../../services/photos-api.service';
import { FavoritesService } from '../../../favorites/services/favorites.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Spinner } from "../../../../shared/ui/spinner/spinner";
import { EmptyState } from "../../../../shared/ui/empty-state/empty-state";
import { PhotoCard } from "../../../../shared/ui/photo-card/photo-card";
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/notifications/toast.service';

@Component({
  selector: 'app-photo-details',
  imports: [Spinner, EmptyState, PhotoCard, MatButtonModule],
  templateUrl: './photo-details.html',
  styleUrl: './photo-details.scss',
})
export class PhotoDetails implements OnInit {
  readonly id = input.required<string>();

  private readonly photosApiService = inject(PhotosApiService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);

  readonly photo = signal<Photo | null>(null);
  readonly loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadImage();
  }

  loadImage(): void {
    if (this.loading()) return;

    const photoId = parseInt(this.id());

    if (Number.isNaN(photoId)) return;

    if (!this.favoritesService.isFavorite(photoId)) return;

    this.loading.set(true);

    this.photosApiService.getPhotoById(photoId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (photo) => {
        this.photo.set(photo)
      },
      error: () => {
        this.toast.error('Something went wrong...');
      },
      complete: () => {
        this.loading.set(false);
      },
    })
  }

  readonly isEmpty = computed(() => !this.photo() && !this.loading());

  handleRemoveFromFavorites(): void {
    const photoId = this.photo()?.id;

    if (!photoId) {
      this.toast.error('Something went wrong...');
      return;
    }

    this.favoritesService.remove(photoId);
    this.router.navigateByUrl('/favorites');
  }
}
