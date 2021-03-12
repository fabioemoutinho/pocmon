import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { resetStepsToBattle } from '../map/map.actions';
import * as PokemonActions from './pokemon.actions';
import { PokemonService } from './pokemon.service';

@Injectable()
export class PokemonEffects {
  loadPokemon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.loadPokemon),
      mergeMap(() =>
        this.pokemonService.getAll().pipe(
          map((pokemon) => PokemonActions.loadPokemonSuccess({ pokemon })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  selectPokemon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.selectPokemon),
      map((props) => {
        if (props.pokemonId) {
          this.router.navigate(['battle']);
        } else {
          this.router.navigate(['map']);
        }
        return resetStepsToBattle();
      })
    )
  );

  capturePokemon$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PokemonActions.capturePokemon),
        tap((_props) => this.router.navigate(['map']))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  ngrxOnInitEffects(): Action {
    return PokemonActions.loadPokemon();
  }
}
