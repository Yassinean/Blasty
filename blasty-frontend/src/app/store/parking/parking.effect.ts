import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as ParkingActions from './parking.action';
import { ParkingService } from '../../core/services/parking.service';

@Injectable()
export class ParkingEffects {
  constructor(private actions$: Actions, private parkingService: ParkingService) {}

  loadParkings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.loadParkings),
      mergeMap(() =>
        this.parkingService.getAllParkings().pipe(
          map(parkings => ParkingActions.loadParkingsSuccess({ parkings })),
          catchError(error => of(ParkingActions.loadParkingsFailure({ error: error.message })))
        )
      )
    )
  );

  addParking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.addParking),
      mergeMap(action =>
        this.parkingService.createParking(action.parking).pipe(
          map(parking => ParkingActions.addParkingSuccess({ parking })),
          catchError(error => of(ParkingActions.addParkingFailure({ error: error.message })))
        )
      )
    )
  );

  deleteParking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParkingActions.deleteParking),
      mergeMap(action =>
        this.parkingService.deleteParking(action.id).pipe(
          map(() => ParkingActions.deleteParkingSuccess({ id: action.id })),
          catchError(error => of(ParkingActions.deleteParkingFailure({ error: error.message })))
        )
      )
    )
  );
}
