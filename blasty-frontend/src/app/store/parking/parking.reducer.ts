import { createReducer, on } from '@ngrx/store';
import * as ParkingActions from './parking.action';
import { Parking } from '../../core/models/parking.model';

export interface ParkingState {
  parkings: Parking[];
  selectedParking: Parking | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ParkingState = {
  parkings: [],
  selectedParking: null,
  loading: false,
  error: null
};

export const parkingReducer = createReducer(
  initialState,
  on(ParkingActions.loadParkings, (state) => ({ ...state, loading: true })),
  on(ParkingActions.loadParkingsSuccess, (state, { parkings }) => ({
    ...state, parkings, loading: false, error: null
  })),
  on(ParkingActions.loadParkingsFailure, (state, { error }) => ({
    ...state, loading: false, error
  })),
  on(ParkingActions.loadParkingSuccess, (state, { parking }) => ({
    ...state, selectedParking: parking, loading: false, error: null
  })),
  on(ParkingActions.deleteParkingSuccess, (state, { id }) => ({
    ...state,
    parkings: state.parkings.filter(p => p.id !== id)
  }))
);
