import { Observable, of } from 'rxjs';

import { Photo } from '../../features/photos/models/photo.model';
import { PhotosApiService } from '../../features/photos/services/photos-api.service';

export interface PhotosApiServiceMock {
  service: Pick<PhotosApiService, 'getPhotoById' | 'getPhotos' | 'getPhotosByIds'>;
  getPhotoByIdCalls: number[];
  getPhotosCalls: Array<{ page: number; limit: number }>;
  getPhotosByIdsCalls: number[][];
  setGetPhotoByIdResponse: (response: Observable<Photo | null>) => void;
  setGetPhotosResponse: (response: Observable<Photo[]>) => void;
  setGetPhotosByIdsResponse: (response: Observable<Photo[]>) => void;
}

export const createPhotosApiServiceMock = (options?: {
  getPhotoByIdResponse?: Observable<Photo | null>;
  getPhotosResponse?: Observable<Photo[]>;
  getPhotosByIdsResponse?: Observable<Photo[]>;
}): PhotosApiServiceMock => {
  let getPhotoByIdResponse = options?.getPhotoByIdResponse ?? of(null);
  let getPhotosResponse = options?.getPhotosResponse ?? of([]);
  let getPhotosByIdsResponse = options?.getPhotosByIdsResponse ?? of([]);

  const getPhotoByIdCalls: number[] = [];
  const getPhotosCalls: Array<{ page: number; limit: number }> = [];
  const getPhotosByIdsCalls: number[][] = [];

  const service = {
    getPhotoById: (id: number) => {
      getPhotoByIdCalls.push(id);
      return getPhotoByIdResponse;
    },
    getPhotos: (page: number, limit: number) => {
      getPhotosCalls.push({ page, limit });
      return getPhotosResponse;
    },
    getPhotosByIds: (ids: number[]) => {
      getPhotosByIdsCalls.push(ids);
      return getPhotosByIdsResponse;
    }
  };

  return {
    service,
    getPhotoByIdCalls,
    getPhotosCalls,
    getPhotosByIdsCalls,
    setGetPhotoByIdResponse: (response) => {
      getPhotoByIdResponse = response;
    },
    setGetPhotosResponse: (response) => {
      getPhotosResponse = response;
    },
    setGetPhotosByIdsResponse: (response) => {
      getPhotosByIdsResponse = response;
    }
  };
};
