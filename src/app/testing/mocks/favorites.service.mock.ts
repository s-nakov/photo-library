import { BehaviorSubject } from 'rxjs';

import { FavoritesService } from '../../features/favorites/services/favorites.service';

export interface FavoritesServiceMock {
  service: Pick<
    FavoritesService,
    'favoritesIdsChanges' | 'getIdsSnapshot' | 'isFavorite' | 'add' | 'remove' | 'toggle' | 'clear'
  >;
  ids$: BehaviorSubject<Set<number>>;
  isFavoriteCalls: number[];
  addCalls: number[];
  removeCalls: number[];
  setIds: (ids: number[]) => void;
}

export const createFavoritesServiceMock = (initialIds: number[] = []): FavoritesServiceMock => {
  const ids$ = new BehaviorSubject(new Set(initialIds));
  const isFavoriteCalls: number[] = [];
  const addCalls: number[] = [];
  const removeCalls: number[] = [];

  const setIds = (ids: number[]) => {
    ids$.next(new Set(ids));
  };

  const add = (id: number) => {
    addCalls.push(id);
    const next = new Set(ids$.value);
    next.add(id);
    ids$.next(next);
  };

  const remove = (id: number) => {
    removeCalls.push(id);
    const next = new Set(ids$.value);
    next.delete(id);
    ids$.next(next);
  };

  const toggle = (id: number) => {
    ids$.value.has(id) ? remove(id) : add(id);
  };

  const clear = () => {
    ids$.next(new Set());
  };

  const service = {
    favoritesIdsChanges: () => ids$.asObservable(),
    getIdsSnapshot: () => new Set(ids$.value),
    isFavorite: (id: number) => {
      isFavoriteCalls.push(id);
      return ids$.value.has(id);
    },
    add,
    remove,
    toggle,
    clear
  };

  return {
    service,
    ids$,
    isFavoriteCalls,
    addCalls,
    removeCalls,
    setIds
  };
};
