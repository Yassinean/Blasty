// place.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as PlaceActions from './place.action';
import { PlaceService } from '../../core/services/place.service';

@Injectable()
export class PlaceEffects {
  constructor(private actions$: Actions, private placeService: PlaceService) {}

  loadPlaces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlaceActions.loadPlaces),
      mergeMap(() =>
        this.placeService.getAllPlaces().pipe(
          map((places) => PlaceActions.loadPlacesSuccess({ places })),
          catchError((error) => of(PlaceActions.loadPlacesFailure({ error: error.message })))
        )
      )
    )
  );

  createPlace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlaceActions.createPlace),
      mergeMap((action) =>
        this.placeService.createPlace(action.place).pipe(
          map((place) => PlaceActions.createPlaceSuccess({ place })),
          catchError((error) => of(PlaceActions.createPlaceFailure({ error: error.message })))
        )
      )
    )
  );

  deletePlace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlaceActions.deletePlace),
      mergeMap((action) =>
        this.placeService.deletePlace(action.id).pipe(
          map(() => PlaceActions.deletePlaceSuccess({ id: action.id })),
          catchError((error) => of(PlaceActions.deletePlaceFailure({ error: error.message })))
        )
      )
    )
  );
}