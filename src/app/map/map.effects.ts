import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as MapActions from './map.actions';
import { selectMapState } from './map.selectors';
import { MapService } from './map.service';

@Injectable()
export class MapEffects {
  loadMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.loadMap),
      mergeMap(() =>
        this.mapService.getMap().pipe(
          map((response) => MapActions.loadMapSuccess({ tiles: response })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  move$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.move),
      concatLatestFrom(() => this.store$.select(selectMapState)),
      map(([props, { coordinates, tiles }]) =>
        MapActions.moveSuccess(
          this.mapService.move(props.direction, coordinates, tiles)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store$: Store,
    private mapService: MapService
  ) {}

  ngrxOnInitEffects(): Action {
    return MapActions.loadMap();
  }
}
