import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ParkingState } from '../reducers/parking.reducer';

export const selectParkingState = createFeatureSelector<ParkingState>('parkings');

export const selectAllParkings = createSelector(
  selectParkingState,
  (state) => state.parkings
);
