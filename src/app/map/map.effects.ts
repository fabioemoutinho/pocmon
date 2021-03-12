import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, tap, switchMap } from 'rxjs/operators';
import { selectPokemon } from '../pokemon/pokemon.actions';
import { PokemonService } from '../pokemon/pokemon.service';
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
          switchMap((response) => [
            MapActions.loadMapSuccess({ tiles: response }),
            MapActions.resetStepsToBattle(),
          ]),
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

  battle$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MapActions.moveSuccess),
        concatLatestFrom(() => this.store$.select(selectMapState)),
        tap(([_action, { currentTile, stepsToBattle }]) => {
          if (this.mapService.canBattle(stepsToBattle, currentTile)) {
            this.store$.dispatch(
              selectPokemon({
                pokemonId: this.pokemonService.getRandomPokemonId(),
              })
            );
          }
        })
      ),
    { dispatch: false }
  );

  decrementStepsToBattle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.move),
      concatLatestFrom(() => this.store$.select(selectMapState)),
      map(([_props, { stepsToBattle, currentTile }]) => {
        if (
          this.mapService.decrementStepsToBattle(stepsToBattle, currentTile)
        ) {
          return MapActions.decrementStepsToBattleSuccess();
        } else {
          return MapActions.decrementStepsToBattleNoOp();
        }
      })
    )
  );

  resetStepsToBattle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapActions.resetStepsToBattle),
      map((_action) =>
        MapActions.resetStepsToBattleSuccess({
          steps: this.mapService.resetStepsToBattle(),
        })
      )
    )
  );

  resetStepsToBattleAfterMove$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MapActions.moveSuccess),
        concatLatestFrom(() => this.store$.select(selectMapState)),
        tap(([_props, { currentTile, previousTile }]) => {
          if (
            this.mapService.canResetStepsToBattleAfterMove(
              currentTile,
              previousTile
            )
          ) {
            this.store$.dispatch(MapActions.resetStepsToBattle());
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store$: Store,
    private mapService: MapService,
    private pokemonService: PokemonService
  ) {}

  ngrxOnInitEffects(): Action {
    return MapActions.loadMap();
  }
}
