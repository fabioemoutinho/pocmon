import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
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

  constructor(
    private actions$: Actions,
    private pokemonService: PokemonService
  ) {}

  ngrxOnInitEffects(): Action {
    return PokemonActions.loadPokemon();
  }
}
