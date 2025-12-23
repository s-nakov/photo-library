import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Photo } from '../../../features/photos/models/photo.model';
import { PhotoCard } from '../photo-card/photo-card';
import { Spinner } from '../spinner/spinner';
import { PhotoGrid } from './photo-grid';

describe('PhotoGrid', () => {
  const setup = async (inputs: { photos: Photo[]; loading?: boolean }) => {
    const fixture = TestBed.createComponent(PhotoGrid);

    fixture.componentRef.setInput('photos', inputs.photos);

    if (inputs.loading !== undefined) {
      fixture.componentRef.setInput('loading', inputs.loading);
    }

    fixture.detectChanges();
    await fixture.whenStable();

    return fixture;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGrid]
    })
    .compileComponents();
  });

  it('should create', async () => {
    const fixture = await setup({ photos: [] });

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a photo card for each photo', async () => {
    const photos: Photo[] = [
      { id: 1, url: '/photo-1.jpg' },
      { id: 2, url: '/photo-2.jpg' }
    ];
    const fixture = await setup({ photos });
    const cards = fixture.debugElement.queryAll(By.directive(PhotoCard));

    expect(cards.length).toBe(photos.length);
    cards.forEach((card, index) => {
      const cardInstance = card.componentInstance as PhotoCard;

      expect(cardInstance.photo()).toEqual(photos[index]);
    });
  });

  it('should not render the spinner when loading is false', async () => {
    const fixture = await setup({ photos: [], loading: false });
    const spinner = fixture.debugElement.query(By.directive(Spinner));

    expect(spinner).toBeFalsy();
  });

  it('should render the spinner when loading is true', async () => {
    const fixture = await setup({ photos: [], loading: true });
    const spinner = fixture.debugElement.query(By.directive(Spinner));

    expect(spinner).toBeTruthy();
  });
});
