import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { ToastService } from '../../../../core/notifications/toast.service';
import { FavoritesService } from '../../../favorites/services/favorites.service';
import { Photo } from '../../models/photo.model';
import { PhotosApiService } from '../../services/photos-api.service';
import { createFavoritesServiceMock, FavoritesServiceMock } from '../../../../testing/mocks/favorites.service.mock';
import { createPhotosApiServiceMock, PhotosApiServiceMock } from '../../../../testing/mocks/photos-api.service.mock';
import { createRouterMock, RouterMock } from '../../../../testing/mocks/router.mock';
import { createToastServiceMock, ToastServiceMock } from '../../../../testing/mocks/toast.service.mock';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PhotoCard } from '../../../../shared/ui/photo-card/photo-card';
import { Spinner } from '../../../../shared/ui/spinner/spinner';
import { PhotoDetails } from './photo-details';
import { RouterTestingHarness } from '@angular/router/testing';

describe('PhotoDetails', () => {
  let component: PhotoDetails;
  let fixture: ComponentFixture<PhotoDetails>;

  const defaultPhoto: Photo = { id: 10, url: '/assets/photo-10.jpg' };

  let photosApiMock: PhotosApiServiceMock;
  let favoritesMock: FavoritesServiceMock;
  let routerMock: RouterMock;
  let toastMock: ToastServiceMock;

  const setup = async (id: string) => {
    fixture = TestBed.createComponent(PhotoDetails);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    photosApiMock = createPhotosApiServiceMock({
      getPhotoByIdResponse: of(defaultPhoto)
    });
    favoritesMock = createFavoritesServiceMock([defaultPhoto.id]);
    routerMock = createRouterMock();
    toastMock = createToastServiceMock();

    await TestBed.configureTestingModule({
      imports: [PhotoDetails],
      providers: [
        { provide: PhotosApiService, useValue: photosApiMock.service },
        { provide: FavoritesService, useValue: favoritesMock.service },
        { provide: Router, useValue: routerMock.service },
        { provide: ToastService, useValue: toastMock.service }
      ]
    })
      .compileComponents();
  });

  it('should create', async () => {
    await setup('10');

    expect(component).toBeTruthy();
  });

  it('should bind the route param id to the component input', async () => {
    TestBed.resetTestingModule();

    const routePhotosApiMock = createPhotosApiServiceMock({
      getPhotoByIdResponse: of(defaultPhoto)
    });
    const routeFavoritesMock = createFavoritesServiceMock([]);
    const routeToastMock = createToastServiceMock();

    await TestBed.configureTestingModule({
      imports: [PhotoDetails],
      providers: [
        provideRouter([{ path: 'photos/:id', component: PhotoDetails }], withComponentInputBinding()),
        { provide: PhotosApiService, useValue: routePhotosApiMock.service },
        { provide: FavoritesService, useValue: routeFavoritesMock.service },
        { provide: ToastService, useValue: routeToastMock.service }
      ],
    }).compileComponents();

    const harness = await RouterTestingHarness.create();
    const instance = await harness.navigateByUrl('/photos/9', PhotoDetails);

    expect(instance.id()).toBe('9');
  });

  it('should load the photo when the id is valid and favorite', async () => {
    await setup('10');

    expect(favoritesMock.isFavoriteCalls).toEqual([10]);
    expect(photosApiMock.getPhotoByIdCalls).toEqual([10]);
    expect(component.photo()).toEqual(defaultPhoto);
    expect(component.loading()).toBe(false);
  });

  it('should render the photo card when the photo is available', async () => {
    await setup('10');
    fixture.detectChanges();

    const photoCard = fixture.debugElement.query(By.directive(PhotoCard));
    const emptyState = fixture.debugElement.query(By.directive(EmptyState));
    const spinner = fixture.debugElement.query(By.directive(Spinner));

    expect(photoCard).toBeTruthy();
    expect((photoCard.componentInstance as PhotoCard).photo()).toEqual(defaultPhoto);
    expect(emptyState).toBeFalsy();
    expect(spinner).toBeFalsy();
  });

  it('should render the empty state when the photo is not a favorite', async () => {
    favoritesMock.setIds([]);

    await setup('10');
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.directive(EmptyState));

    expect(photosApiMock.getPhotoByIdCalls).toEqual([]);
    expect(emptyState).toBeTruthy();
  });

  it('should render the empty state when the id is invalid', async () => {
    await setup('not-a-number');
    fixture.detectChanges();

    const emptyState = fixture.debugElement.query(By.directive(EmptyState));

    expect(favoritesMock.isFavoriteCalls).toEqual([]);
    expect(photosApiMock.getPhotoByIdCalls).toEqual([]);
    expect(emptyState).toBeTruthy();
  });

  it('should render the spinner while loading', async () => {
    const subject = new Subject<Photo | null>();
    photosApiMock.setGetPhotoByIdResponse(subject.asObservable());

    await setup('10');
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.directive(Spinner));
    const emptyState = fixture.debugElement.query(By.directive(EmptyState));

    expect(component.loading()).toBe(true);
    expect(spinner).toBeTruthy();
    expect(emptyState).toBeFalsy();

    subject.complete();
  });

  it('should notify the user when the photo fails to load', async () => {
    photosApiMock.setGetPhotoByIdResponse(throwError(() => new Error('load failed')));

    await setup('10');

    expect(toastMock.errorMessages).toEqual(['Something went wrong...']);
  });

  it('should remove the photo from favorites and navigate', async () => {
    await setup('10');
    component.photo.set(defaultPhoto);

    component.handleRemoveFromFavorites();

    expect(favoritesMock.removeCalls).toEqual([defaultPhoto.id]);
    expect(routerMock.navigateByUrlCalls).toEqual(['/favorites']);
  });

  it('should show an error when removing without a photo', async () => {
    await setup('10');
    component.photo.set(null);

    component.handleRemoveFromFavorites();

    expect(favoritesMock.removeCalls).toEqual([]);
    expect(routerMock.navigateByUrlCalls).toEqual([]);
    expect(toastMock.errorMessages).toEqual(['Something went wrong...']);
  });
});
