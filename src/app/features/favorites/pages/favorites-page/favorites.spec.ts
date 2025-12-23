import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { createFavoritesServiceMock, FavoritesServiceMock } from '../../../../testing/mocks/favorites.service.mock';
import { createPhotosApiServiceMock, PhotosApiServiceMock } from '../../../../testing/mocks/photos-api.service.mock';
import { createRouterMock, RouterMock } from '../../../../testing/mocks/router.mock';
import { createToastServiceMock, ToastServiceMock } from '../../../../testing/mocks/toast.service.mock';
import { FavoritesService } from '../../services/favorites.service';
import { PhotosApiService } from '../../../photos/services/photos-api.service';
import { ToastService } from '../../../../core/notifications/toast.service';
import { Router } from '@angular/router';
import { Photo } from '../../../photos/models/photo.model';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PhotoGrid } from '../../../../shared/ui/photo-grid/photo-grid';
import { Favorites } from './favorites';

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;
  let favoritesMock: FavoritesServiceMock;
  let photosApiMock: PhotosApiServiceMock;
  let toastMock: ToastServiceMock;
  let routerMock: RouterMock;

  const defaultPhotos: Photo[] = [
    { id: 11, url: '/photo-11.jpg' },
    { id: 12, url: '/photo-12.jpg' }
  ];

  const setup = async () => {
    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    favoritesMock = createFavoritesServiceMock([11, 12]);
    photosApiMock = createPhotosApiServiceMock({
      getPhotosByIdsResponse: of(defaultPhotos)
    });
    toastMock = createToastServiceMock();
    routerMock = createRouterMock();

    if (!(globalThis as any).requestAnimationFrame) {
      (globalThis as any).requestAnimationFrame = (callback: FrameRequestCallback) =>
        setTimeout(callback, 0) as unknown as number;
    }

    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [
        { provide: FavoritesService, useValue: favoritesMock.service },
        { provide: PhotosApiService, useValue: photosApiMock.service },
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

  it('should load favorites on init', async () => {
    await setup();

    expect(photosApiMock.getPhotosByIdsCalls).toContainEqual([11, 12]);
    expect(component.favorites()).toEqual(defaultPhotos);
    expect(component.loading()).toBe(false);
  });

  it('should render the photo grid with favorite photos', async () => {
    await setup();
    fixture.detectChanges();

    const grid = fixture.debugElement.query(By.directive(PhotoGrid));
    const emptyState = fixture.debugElement.query(By.directive(EmptyState));

    expect(grid).toBeTruthy();
    expect((grid.componentInstance as PhotoGrid).photos()).toEqual(defaultPhotos);
    expect(emptyState).toBeFalsy();
  });

  it('should render the empty state when there are no favorites', async () => {
    favoritesMock.setIds([]);
    photosApiMock.setGetPhotosByIdsResponse(of([]));

    await setup();
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.directive(EmptyState));

    expect(component.isEmpty()).toBe(true);
    expect(emptyState).toBeTruthy();
  });

  it('should update favorites when the ids change', async () => {
    await setup();

    photosApiMock.setGetPhotosByIdsResponse(of([{ id: 99, url: '/assets/photo-99.jpg' }]));
    favoritesMock.setIds([99]);
    fixture.detectChanges();
    await fixture.whenStable();

    const lastCall =
      photosApiMock.getPhotosByIdsCalls[photosApiMock.getPhotosByIdsCalls.length - 1];

    expect(lastCall).toEqual([99]);
    expect(component.favorites()).toEqual([{ id: 99, url: '/assets/photo-99.jpg' }]);
  });

  it('should notify the user when loading favorites fails', async () => {
    photosApiMock.setGetPhotosByIdsResponse(throwError(() => new Error('load failed')));

    await setup();

    expect(toastMock.errorMessages).toContain('Something went wrong...');
  });

  it('should navigate to the photo details when the photo is in favorites', async () => {
    await setup();

    component.photoClicked(11);

    expect(routerMock.navigateByUrlCalls).toEqual(['/photos/11']);
  });

  it('should show an error when the photo is not in favorites', async () => {
    favoritesMock.setIds([]);

    await setup();

    component.photoClicked(11);

    expect(routerMock.navigateByUrlCalls).toEqual([]);
    expect(toastMock.errorMessages).toEqual(['Photo is not in your favorites list']);
  });
});
