import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Photo } from '../../../features/photos/models/photo.model';
import { PhotoCard } from './photo-card';
import { PHOTO_CARD_ACTIONS, PhotoCardActions } from './photo-card.actions';

describe('PhotoCard', () => {
  const defaultPhoto: Photo = { id: 42, url: '/photo-42.jpg' };

  const setup = async (options?: { actions?: PhotoCardActions; photo?: Photo }) => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [PhotoCard],
      providers: options?.actions
        ? [{ provide: PHOTO_CARD_ACTIONS, useValue: options.actions }]
        : []
    })
    .compileComponents();

    const fixture = TestBed.createComponent(PhotoCard);
    const photo = options?.photo ?? defaultPhoto;

    fixture.componentRef.setInput('photo', photo);
    fixture.detectChanges();
    await fixture.whenStable();

    return { fixture, photo };
  };

  it('should create', async () => {
    const { fixture } = await setup();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the image with src and alt from the photo', async () => {
    const { fixture, photo } = await setup();
    const image = fixture.debugElement.query(By.css('.photo-card-img'));

    expect(image).toBeTruthy();
    expect(image.nativeElement.getAttribute('src')).toBe(photo.url);
    expect(image.nativeElement.getAttribute('alt')).toBe(`Photo ${photo.id}`);
  });

  it('should not mark the card as clickable when no actions are provided', async () => {
    const { fixture } = await setup();
    const card = fixture.debugElement.query(By.css('.photo-card'));

    expect(card.nativeElement.classList.contains('clickable')).toBe(false);
  });

  it('should mark the card as clickable when actions are provided', async () => {
    const actions: PhotoCardActions = { photoClicked: () => undefined };
    const { fixture } = await setup({ actions });
    const card = fixture.debugElement.query(By.css('.photo-card'));

    expect(card.nativeElement.classList.contains('clickable')).toBe(true);
  });

  it('should notify actions when the card is clicked', async () => {
    const calls: number[] = [];
    const actions: PhotoCardActions = {
      photoClicked: (photoId) => {
        calls.push(photoId);
      }
    };
    const { fixture, photo } = await setup({ actions });
    const card = fixture.debugElement.query(By.css('.photo-card'));

    card.triggerEventHandler('click');

    expect(calls).toEqual([photo.id]);
  });
});
