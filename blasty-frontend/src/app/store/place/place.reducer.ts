// place.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as PlaceActions from './place.action';
import { Place } from '../../core/models/place.model';

export interface PlaceState {
  places: Place[];
  loading: boolean;
  error: string | null;
}

export const initialState: PlaceState = {
  places: [],
  loading: false,
  error: null,
};

export const placeReducer = createReducer(
  initialState,
  on(PlaceActions.loadPlaces, (state) => ({ ...state, loading: true })),
  on(PlaceActions.loadPlacesSuccess, (state, { places }) => ({
    ...state,
    places,
    loading: false,
    error: null,
  })),
  on(PlaceActions.loadPlacesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(PlaceActions.createPlaceSuccess, (state, { place }) => ({
    ...state,
    places: [...state.places, place],
  })),
  on(PlaceActions.deletePlaceSuccess, (state, { id }) => ({
    ...state,
    places: state.places.filter((p) => p.id !== id),
  }))
);