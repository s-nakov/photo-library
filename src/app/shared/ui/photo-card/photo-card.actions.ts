import { InjectionToken } from '@angular/core';

export interface PhotoCardActions {
    photoClicked(photoId: number): void;
}

export const PHOTO_CARD_ACTIONS = new InjectionToken<PhotoCardActions>(
    'PHOTO_CARD_ACTIONS'
);