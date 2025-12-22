import { Component, input } from '@angular/core';
import { Photo } from '../../../features/photos/models/photo.model';
import { PhotoCard } from '../photo-card/photo-card';
import { Spinner } from '../spinner/spinner';

@Component({
  selector: 'app-photo-grid',
  imports: [PhotoCard, Spinner],
  templateUrl: './photo-grid.html',
  styleUrl: './photo-grid.scss',
})
export class PhotoGrid {
  readonly photos = input.required<Photo[]>();
  readonly loading = input<boolean>();
}
