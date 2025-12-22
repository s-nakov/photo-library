import { Component, input } from '@angular/core';
import { Photo } from '../../../features/photos/models/photo.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-photo-card',
  imports: [CommonModule, MatCardModule],
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
}
