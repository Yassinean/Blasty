import { createAction, props } from '@ngrx/store';
import { Parking } from '../../core/models/parking.model';

// Charger les parkings
export const loadParkings = createAction('[Parking] Load Parkings');
export const loadParkingsSuccess = createAction('[Parking] Load Parkings Success', props<{ parkings: Parking[] }>());
export const loadParkingsFailure = createAction('[Parking] Load Parkings Failure', props<{ error: string }>());

// Charger un parking
export const loadParking = createAction('[Parking] Load Parking', props<{ id: number }>());
export const loadParkingSuccess = createAction('[Parking] Load Parking Success', props<{ parking: Parking }>());
export const loadParkingFailure = createAction('[Parking] Load Parking Failure', props<{ error: string }>());

// Ajouter un parking
export const addParking = createAction('[Parking] Add Parking', props<{ parking: Parking }>());
export const addParkingSuccess = createAction('[Parking] Add Parking Success', props<{ parking: Parking }>());
export const addParkingFailure = createAction('[Parking] Add Parking Failure', props<{ error: string }>());

// Mettre à jour un parking
export const updateParking = createAction('[Parking] Update Parking', props<{ parking: Parking }>());
export const updateParkingSuccess = createAction('[Parking] Update Parking Success', props<{ parking: Parking }>());
export const updateParkingFailure = createAction('[Parking] Update Parking Failure', props<{ error: string }>());

// Supprimer un parking
export const deleteParking = createAction('[Parking] Delete Parking', props<{ id: number }>());
export const deleteParkingSuccess = createAction('[Parking] Delete Parking Success', props<{ id: number }>());
export const deleteParkingFailure = createAction('[Parking] Delete Parking Failure', props<{ error: string }>());
