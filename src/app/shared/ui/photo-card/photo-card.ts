import { Component, inject, input } from '@angular/core';
import { Photo } from '../../../features/photos/models/photo.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PHOTO_CARD_ACTIONS } from './photo-card.actions';

@Component({
  selector: 'app-photo-card',
  imports: [CommonModule, MatCardModule],
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();

  private readonly actions = inject(PHOTO_CARD_ACTIONS, { optional: true });

  get clickable(): boolean {
    return !!this.actions;
  }

  handleClick() {
    this.actions?.photoClicked(this.photo().id);
  }
}
