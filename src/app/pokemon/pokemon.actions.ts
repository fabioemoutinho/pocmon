import { createAction, props } from '@ngrx/store';
import { Pokemon } from './pokemon.reducer';

export const loadPokemon = createAction('[Pokemon] Load Pokemon');

export const loadPokemonSuccess = createAction(
  '[Pokemon] Load Pokemon Success',
  props<{ pokemon: Pokemon[] }>()
);

export const selectPokemon = createAction(
  '[Pokemon] Select Pokemon',
  props<{ pokemonId: number }>()
);
