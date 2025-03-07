// place.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlaceState } from './place.reducer';

export const selectPlaceState = createFeatureSelector<PlaceState>('places');

export const selectAllPlaces = createSelector(
  selectPlaceState,
  (state) => state.places
);

export const selectPlaceLoading = createSelector(
  selectPlaceState,
  (state) => state.loading
);

export const selectPlaceError = createSelector(
  selectPlaceState,
  (state) => state.error
);