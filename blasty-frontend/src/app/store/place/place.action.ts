// place.actions.ts
import { createAction, props } from '@ngrx/store';
import { Place } from '../../core/models/place.model';

// Load Places
export const loadPlaces = createAction('[Place] Load Places');
export const loadPlacesSuccess = createAction('[Place] Load Places Success', props<{ places: Place[] }>());
export const loadPlacesFailure = createAction('[Place] Load Places Failure', props<{ error: string }>());

// Create Place
export const createPlace = createAction('[Place] Create Place', props<{ place: Place }>());
export const createPlaceSuccess = createAction('[Place] Create Place Success', props<{ place: Place }>());
export const createPlaceFailure = createAction('[Place] Create Place Failure', props<{ error: string }>());

// Update Place
export const updatePlace = createAction('[Place] Update Place', props<{ place: Place }>());
export const updatePlaceSuccess = createAction('[Place] Update Place Success', props<{ place: Place }>());
export const updatePlaceFailure = createAction('[Place] Update Place Failure', props<{ error: string }>());

// Delete Place
export const deletePlace = createAction('[Place] Delete Place', props<{ id: number }>());
export const deletePlaceSuccess = createAction('[Place] Delete Place Success', props<{ id: number }>());
export const deletePlaceFailure = createAction('[Place] Delete Place Failure', props<{ error: string }>());