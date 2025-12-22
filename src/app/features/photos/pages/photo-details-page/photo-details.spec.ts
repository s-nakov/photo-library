import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoDetails } from './photo-details';

describe('PhotoDetails', () => {
  let component: PhotoDetails;
  let fixture: ComponentFixture<PhotoDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
