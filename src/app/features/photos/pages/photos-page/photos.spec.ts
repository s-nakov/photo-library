import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { createFavoritesServiceMock, FavoritesServiceMock } from '../../../../testing/mocks/favorites.service.mock';
import { createPhotosApiServiceMock, PhotosApiServiceMock } from '../../../../testing/mocks/photos-api.service.mock';
import { createRouterMock, RouterMock } from '../../../../testing/mocks/router.mock';
import { createToastServiceMock, ToastServiceMock } from '../../../../testing/mocks/toast.service.mock';
import { Photo } from '../../models/photo.model';
import { PhotosApiService } from '../../services/photos-api.service';
import { FavoritesService } from '../../../favorites/services/favorites.service';
import { ToastService } from '../../../../core/notifications/toast.service';
import { Router } from '@angular/router';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PhotoGrid } from '../../../../shared/ui/photo-grid/photo-grid';
import { Photos } from './photos';

describe('Photos', () => {
  let component: Photos;
  let fixture: ComponentFixture<Photos>;
  let photosApiMock: PhotosApiServiceMock;
  let favoritesMock: FavoritesServiceMock;
  let toastMock: ToastServiceMock;
  let routerMock: RouterMock;

  const defaultPhotos: Photo[] = [
    { id: 1, url: '/photo-1.jpg' },
    { id: 2, url: '/photo-2.jpg' }
  ];

  const setup = async () => {
    fixture = TestBed.createComponent(Photos);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    photosApiMock = createPhotosApiServiceMock({
      getPhotosResponse: of(defaultPhotos)
    });
    favoritesMock = createFavoritesServiceMock();
    toastMock = createToastServiceMock();
    routerMock = createRouterMock();

    if (!(globalThis as any).requestAnimationFrame) {
      (globalThis as any).requestAnimationFrame = (callback: FrameRequestCallback) =>
        setTimeout(callback, 0) as unknown as number;
    }

    if (!(globalThis as any).IntersectionObserver) {
      (globalThis as any).IntersectionObserver = class {
        observe() { }
        disconnect() { }
      };
    }

    await TestBed.configureTestingModule({
      imports: [Photos],
      providers: [
        { provide: PhotosApiService, useValue: photosApiMock.service },
        { provide: FavoritesService, useValue: favoritesMock.service },
        { provide: ToastService, useValue: toastMock.service },
        { provide: Router, useValue: routerMock.service }
      ]
    })
      .compileComponents();
  });

  it('should create', async () => {
    await setup();

    expect(component).toBeTruthy();
  });

  it('should load the first page of photos on init', async () => {
    await setup();

    expect(photosApiMock.getPhotosCalls).toEqual([{ page: 1, limit: 20 }]);
    expect(component.photos()).toEqual(defaultPhotos);
    expect(component.loading()).toBe(false);
  });

  it('should render the photo grid with the loaded photos', async () => {
    await setup();
    fixture.detectChanges();

    const grid = fixture.debugElement.query(By.directive(PhotoGrid));
    const emptyState = fixture.debugElement.query(By.directive(EmptyState));

    expect(grid).toBeTruthy();
    expect((grid.componentInstance as PhotoGrid).photos()).toEqual(defaultPhotos);
    expect(emptyState).toBeFalsy();
  });

  it('should render the empty state when no photos are returned', async () => {
    photosApiMock.setGetPhotosResponse(of([]));

    await setup();
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.directive(EmptyState));

    expect(component.hasMore()).toBe(false);
    expect(emptyState).toBeTruthy();
  });

  it('should notify the user when loading photos fails', async () => {
    photosApiMock.setGetPhotosResponse(throwError(() => new Error('load failed')));

    await setup();

    expect(toastMock.errorMessages).toEqual(['Something went wrong...']);
  });

  it('should load the next page when loadMore is called', async () => {
    await setup();

    component.loadMore();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(photosApiMock.getPhotosCalls).toEqual([
      { page: 1, limit: 20 },
      { page: 2, limit: 20 }
    ]);
  });

  it('should add the photo to favorites when it is not already a favorite', async () => {
    await setup();

    component.photoClicked(5);

    expect(favoritesMock.addCalls).toEqual([5]);
    expect(toastMock.successMessages).toEqual(['Photo added to favorites']);
  });

  it('should report an error when the photo is already a favorite', async () => {
    favoritesMock.setIds([5]);

    await setup();

    component.photoClicked(5);

    expect(favoritesMock.addCalls).toEqual([]);
    expect(toastMock.errorMessages).toEqual(['Photo is already added to favorites!']);
  });
});
